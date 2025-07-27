import axios from 'axios';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import AuthContext from '../../store/auth';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox, Field, Input, Button, DateInput, Heading } from '@optiaxiom/react';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Config from '../../config';

const Doctor = () => {
  const [slotSchedules, setSlotSchedules] = useState([]);
  const [selectedSlotSchedule, setSelectedSlotSchedule] = useState(null);
  const [date, setDate] = useState(null);
  const [parent, setParent] = useState('');
  const [appointments, setAppointments] = useState(null);

  const authCtx = useContext(AuthContext);
  const { branchId, doctorId } = useParams();

  useEffect(() => {
    const url = Config.SERVER_URL + `/slot-schedules?branch_id=${branchId}&employee_id=${doctorId}`;
    axios.get(url).then(({ data }) => {
      setSlotSchedules(data);
    });
  }, [branchId]);

  const getAppointments = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL = Config.SERVER_URL + `/appointments/slot-schedules/${selectedSlotSchedule.id}?date=${date}`;
    axios.get(URL).then(({ data }) => {
      setAppointments(data);
    });
  };

  const makeAppointment = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL = Config.SERVER_URL + `/appointments`;
    const data = {
      patient_id: authCtx.getStoredValue().userId,
      slot_schedule_id: selectedSlotSchedule.id,
      date: date,
    };

    if (parent.length > 0) {
      data.parent = parseInt(parent);
    }

    axios.post(URL, data).then(({ data }) => {
      console.log(data);
    });
  };

  const columnHelper = createColumnHelper();

  const slotColumns = useMemo(
    () => [
      {
        id: 'select',
        size: 50,
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            disabled={!row.getCanSelect()}
          />
        ),
      },
      columnHelper.accessor('day', {
        id: 'day',
        header: 'Day',
      }),
      columnHelper.accessor('start_at', {
        id: 'start_at',
        header: 'Starting Time',
      }),
      columnHelper.accessor('end_at', {
        id: 'end_at',
        header: 'Ending Time',
      }),
    ],
    []
  );

  const slotData = useMemo(
    () =>
      slotSchedules.map((slotSchedule) => ({
        id: slotSchedule.id,
        start_at: slotSchedule.start_at,
        end_at: slotSchedule.end_at,
        day: slotSchedule.day,
      })),
    [slotSchedules]
  );

  const [slotRowSelection, setSlotRowSelection] = useState({});

  const slotTable = useReactTable({
    columns: slotColumns,
    data: slotData,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setSlotRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection: slotRowSelection,
    },
  });

  useEffect(() => {
    const selectedRows = slotTable.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      setSelectedSlotSchedule(selectedRows[0].original);
    } else {
      setSelectedSlotSchedule(null);
    }
  }, [slotRowSelection, slotTable]);

  const appointmentColumns = useMemo(
    () => [
      columnHelper.accessor('serial_no', {
        id: 'serial_no',
        header: 'SL No',
      }),
      columnHelper.accessor('full_name', {
        id: 'full_name',
        header: 'Patient',
      }),
      columnHelper.accessor('created_at', {
        id: 'created_at',
        header: 'Created At',
      }),
    ],
    []
  );

  const appointmentData = useMemo(
    () =>
      appointments
        ? appointments.map((appointment) => ({
            id: appointment.id,
            serial_no: appointment.serial_no,
            full_name: appointment.full_name,
            created_at: appointment.created_at,
          }))
        : [],
    [appointments]
  );

  const appointmentTable = useReactTable({
    columns: appointmentColumns,
    data: appointmentData,
    getCoreRowModel: getCoreRowModel(),
  });

  const getSelectedSlotSchedule = () => {
    if (!Boolean(selectedSlotSchedule)) {
      return 'N/A';
    }
    return `${selectedSlotSchedule.start_at}:${selectedSlotSchedule.end_at} (${selectedSlotSchedule.day})`;
  };

  return (
    <Flex flexDirection="column" gap="12">
      <Flex flexDirection="column" gap="12" maxW="full">
        <Heading level="1">Appointments</Heading>
        <Field label="Available Slots">
          <DataTable table={slotTable}>
            <DataTableBody />
          </DataTable>
        </Field>
        <Field label="Selected Slot">{getSelectedSlotSchedule()}</Field>
        <Field label="Selected date">
          <DateInput value={date} onValueChange={setDate} w="224" />
        </Field>
        <Field label="Parent Appointment Id (optional)">
          <Input value={parent} onChange={(e) => setParent(e.target.value)} w="224" />
        </Field>
        <Flex justifyContent="flex-end" flexDirection="row" gap="12">
          <Button appearance="inverse" disabled={!Boolean(selectedSlotSchedule) || !date} onClick={getAppointments}>
            View
          </Button>
          <Button
            appearance="primary"
            disabled={!authCtx.isLoggedIn || !date || !Boolean(selectedSlotSchedule)}
            onClick={makeAppointment}
          >
            Create
          </Button>
        </Flex>
      </Flex>

      <Dialog open={appointments !== null} onOpenChange={(open) => setAppointments(open ? appointments : null)}>
        <DialogContent size="md">
          <DialogHeader>Appointment Details</DialogHeader>
          <DialogBody>
            <DataTable maxH="xs" maxW="full" table={appointmentTable}>
              <DataTableBody />
            </DataTable>
          </DialogBody>
          <DialogFooter>
            <DialogClose appearance="primary">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Flex>
  );
};

export default Doctor;
