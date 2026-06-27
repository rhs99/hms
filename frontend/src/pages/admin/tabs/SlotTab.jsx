import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Box, Button, DataTable, DataTableBody, Field, Flex, Input, Text } from '@optiaxiom/react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FaPlus, FaClock, FaList } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader, useAlertState } from '../_components';

const columnHelper = createColumnHelper();

const SlotTab = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { alert, show, dismiss } = useAlertState();

  const fetchSlots = useCallback(async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/slots`);
      setSlots(data);
    } catch {
      show('danger', 'Failed to load time slots.');
    }
  }, [show]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dismiss();

    try {
      await axios.post(`${Config.SERVER_URL}/slots`, {
        start_at: startTime,
        end_at: endTime,
      });

      setStartTime('');
      setEndTime('');
      show('success', 'Time slot created successfully!');
      await fetchSlots();
    } catch {
      show('danger', 'Failed to create time slot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        size: 80,
      }),
      columnHelper.accessor('start_at', {
        header: 'Start Time',
      }),
      columnHelper.accessor('end_at', {
        header: 'End Time',
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: slots,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex flexDirection="column" gap="20">
      <Card>
        <CardHeader icon={<FaClock />} title="Add New Time Slot" subtitle="Define a reusable appointment time window" />
        <CardBody>
          <Flex flexDirection="column" gap="16">
            <AlertBanner alert={alert} onDismiss={dismiss} />
            <form onSubmit={handleSubmit}>
              <Flex flexDirection="column" gap="16">
                <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                  <Field label="Start Time" required style={{ flex: '1 1 200px' }}>
                    <Input
                      placeholder="e.g., 8 AM"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="End Time" required style={{ flex: '1 1 200px' }}>
                    <Input
                      placeholder="e.g., 12 PM"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </Field>
                </Flex>
                <Box>
                  <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                    {isLoading ? 'Creating...' : 'Create Time Slot'}
                  </Button>
                </Box>
              </Flex>
            </form>
          </Flex>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<FaList />}
          title="Existing Time Slots"
          subtitle={`${slots.length} ${slots.length === 1 ? 'slot' : 'slots'} configured`}
        />
        <CardBody>
          {slots.length === 0 ? (
            <Box p="16" bg="bg.secondary" rounded="md">
              <Text color="fg.tertiary">No time slots created yet.</Text>
            </Box>
          ) : (
            <DataTable table={table}>
              <DataTableBody />
            </DataTable>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default SlotTab;
