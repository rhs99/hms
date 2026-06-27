import axios from 'axios';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

import AuthContext from '../../store/auth';
import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTable,
  DataTableBody,
  Flex,
  Cover,
  DataTableCheckbox,
  Field,
  Input,
  Button,
  DateInput,
  Heading,
  Box,
  Text,
} from '@optiaxiom/react';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Config from '../../config';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBREVIATIONS = {
  Sunday: 'SUN',
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
};
const ABBREVIATED_TO_FULL = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
};

const Doctor = () => {
  const [slotSchedules, setSlotSchedules] = useState([]);
  const [selectedSlotSchedule, setSelectedSlotSchedule] = useState(null);
  const [date, setDate] = useState(null);
  const [parent, setParent] = useState('');
  const [appointments, setAppointments] = useState(null);
  const [dateValidationError, setDateValidationError] = useState('');

  const authCtx = useContext(AuthContext);
  const { branchId, doctorId } = useParams();

  useEffect(() => {
    const url = Config.SERVER_URL + `/slot-schedules?branch_id=${branchId}&employee_id=${doctorId}`;
    axios.get(url).then(({ data }) => {
      setSlotSchedules(data);
    });
  }, [branchId, doctorId]);

  const getAppointments = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL = Config.SERVER_URL + `/slot-schedules/${selectedSlotSchedule.id}/appointments?date=${date}`;
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
        cell: () => (
          <Cover asChild>
            <DataTableCheckbox />
          </Cover>
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
    [columnHelper]
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
    state: { rowSelection: slotRowSelection },
  });

  useEffect(() => {
    const selectedRows = slotTable.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      setSelectedSlotSchedule(selectedRows[0].original);
    } else {
      setSelectedSlotSchedule(null);
    }
  }, [slotRowSelection, slotTable]);

  useEffect(() => {
    if (!selectedSlotSchedule || !date) {
      setDateValidationError('');
      return;
    }

    const selectedDate = new Date(date);
    const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];
    const dayAbbreviation = DAY_ABBREVIATIONS[dayOfWeek];

    // Normalize the slot day (handle both full names and abbreviations)
    const slotDay = selectedSlotSchedule.day.toUpperCase();
    const slotDayFull = ABBREVIATED_TO_FULL[slotDay] || selectedSlotSchedule.day;

    if (dayOfWeek !== slotDayFull && dayAbbreviation !== slotDay) {
      setDateValidationError(
        `The selected date is a ${dayOfWeek}, but the chosen time slot is for ${slotDayFull}. Please select a ${slotDayFull}.`
      );
    } else {
      setDateValidationError('');
    }
  }, [date, selectedSlotSchedule]);

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
    [columnHelper]
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
    if (!selectedSlotSchedule) {
      return 'N/A';
    }
    return `${selectedSlotSchedule.start_at} - ${selectedSlotSchedule.end_at} (${selectedSlotSchedule.day})`;
  };

  return (
    <Box bg="bg.page" p="16" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      <Flex
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        gap="12"
        p="16"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '20px' }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="bg.accent.subtle"
          color="fg.accent.strong"
          rounded="lg"
          style={{ width: '48px', height: '48px', fontSize: '24px' }}
        >
          <FaUserMd />
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Heading level="2" color="fg.default">
            Book Appointment
          </Heading>
          <Text fontSize="sm" color="fg.tertiary">
            Select an available time slot and book your appointment
          </Text>
        </Flex>
      </Flex>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '16px',
        }}
      >
        <Box bg="bg.default" rounded="xl" border="1" borderColor="border.secondary" shadow="sm" p="20">
          <Flex
            flexDirection="row"
            alignItems="center"
            gap="8"
            pb="12"
            borderColor="border.tertiary"
            style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', marginBottom: '16px' }}
          >
            <Box color="fg.accent.strong" style={{ fontSize: '18px', display: 'flex' }}>
              <FaClock />
            </Box>
            <Heading level="4" color="fg.default">
              Available Time Slots
            </Heading>
          </Flex>

          <Flex flexDirection="column" gap="16">
            <Field label="Select a Time Slot">
              <Box rounded="md" border="1" borderColor="border.tertiary" style={{ overflow: 'hidden' }}>
                <DataTable table={slotTable}>
                  <DataTableBody />
                </DataTable>
              </Box>
            </Field>
            {selectedSlotSchedule && (
              <Box bg="bg.page" p="16" rounded="md" border="1" borderColor="border.tertiary">
                <Text fontSize="xs" fontWeight="600" color="fg.tertiary" textTransform="uppercase">
                  Selected Slot
                </Text>
                <Text fontSize="md" fontWeight="600" color="fg.default" style={{ marginTop: '4px' }}>
                  {getSelectedSlotSchedule()}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>

        <Box bg="bg.default" rounded="xl" border="1" borderColor="border.secondary" shadow="sm" p="20">
          <Flex
            flexDirection="row"
            alignItems="center"
            gap="8"
            pb="12"
            borderColor="border.tertiary"
            style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', marginBottom: '16px' }}
          >
            <Box color="fg.accent.strong" style={{ fontSize: '18px', display: 'flex' }}>
              <FaCalendarAlt />
            </Box>
            <Heading level="4" color="fg.default">
              Appointment Details
            </Heading>
          </Flex>

          <Flex flexDirection="column" gap="16">
            <Field label="Select Date">
              <DateInput value={date} onValueChange={setDate} w="full" />
            </Field>
            {dateValidationError && (
              <Flex
                alignItems="center"
                gap="8"
                p="12"
                bg="bg.error.subtle"
                rounded="md"
                color="fg.error.strong"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'var(--ax-colors-fg-error)',
                }}
              >
                <Box color="fg.error" style={{ display: 'flex', flexShrink: 0 }}>
                  <FaExclamationTriangle />
                </Box>
                <Text fontSize="sm" fontWeight="500" color="fg.error.strong">
                  {dateValidationError}
                </Text>
              </Flex>
            )}
            <Field label="Parent Appointment ID (Optional)">
              <Input
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                w="full"
                placeholder="Enter parent appointment ID if follow-up"
              />
            </Field>
            <Flex
              flexDirection="row"
              gap="12"
              justifyContent="flex-end"
              pt="16"
              borderColor="border.tertiary"
              style={{ borderTopWidth: '1px', borderTopStyle: 'solid', marginTop: '8px' }}
            >
              <Button
                appearance="inverse"
                disabled={!selectedSlotSchedule || !date || !!dateValidationError}
                onClick={getAppointments}
                icon={<FaClipboardList />}
              >
                View Appointments
              </Button>
              <Button
                appearance="primary"
                disabled={!authCtx.isLoggedIn || !date || !selectedSlotSchedule || !!dateValidationError}
                onClick={makeAppointment}
                icon={<FaCalendarAlt />}
              >
                Book Appointment
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Dialog open={appointments !== null} onOpenChange={(open) => setAppointments(open ? appointments : null)}>
        <DialogContent size="md">
          <DialogHeader>
            <Flex alignItems="center" gap="8">
              <Box color="fg.accent.strong" style={{ display: 'flex' }}>
                <FaClipboardList />
              </Box>
              Scheduled Appointments
            </Flex>
          </DialogHeader>
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
    </Box>
  );
};

export default Doctor;
