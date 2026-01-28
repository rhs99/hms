import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box, Button, Field, Input, Heading, Text, Flex } from '@optiaxiom/react';
import { DataTable, DataTableBody } from '@optiaxiom/react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';

const columnHelper = createColumnHelper();

const SlotTab = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/slots`);
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      await axios.post(`${Config.SERVER_URL}/slots`, {
        start_at: startTime,
        end_at: endTime,
      });

      setStartTime('');
      setEndTime('');
      setSuccessMessage('Time slot created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchSlots();
    } catch (error) {
      console.error('Error creating slot:', error);
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
    <Box className="settings-tab">
      <Box className="settings-tab-form">
        <Heading level="3">Add New Time Slot</Heading>
        <form onSubmit={handleSubmit}>
          <Flex gap="12">
            <Field label="Start Time" required style={{ flex: 1 }}>
              <Input
                placeholder="e.g., 8 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Field>
            <Field label="End Time" required style={{ flex: 1 }}>
              <Input placeholder="e.g., 12 PM" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </Field>
          </Flex>
          <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
            <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
              {isLoading ? 'Creating...' : 'Create Time Slot'}
            </Button>
            {successMessage && (
              <Flex alignItems="center" gap="8" style={{ color: 'var(--color-success)' }}>
                <FaCheckCircle />
                <Text>{successMessage}</Text>
              </Flex>
            )}
          </Flex>
        </form>
      </Box>

      <Box className="settings-tab-table">
        <Heading level="3">Existing Time Slots</Heading>
        {slots.length === 0 ? (
          <Text color="fg.tertiary">No time slots created yet.</Text>
        ) : (
          <DataTable table={table}>
            <DataTableBody />
          </DataTable>
        )}
      </Box>
    </Box>
  );
};

export default SlotTab;
