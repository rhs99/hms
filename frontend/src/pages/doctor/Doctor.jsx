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

import './_index.scss';

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
    if (!Boolean(selectedSlotSchedule)) {
      return 'N/A';
    }
    return `${selectedSlotSchedule.start_at} - ${selectedSlotSchedule.end_at} (${selectedSlotSchedule.day})`;
  };

  return (
    <Box className="doctor">
      <Box className="doctor-header">
        <Heading level="2" className="doctor-title">
          <FaUserMd size={32} />
          Book Appointment
        </Heading>
        <Text className="doctor-subtitle">Select an available time slot and book your appointment</Text>
      </Box>

      <Box className="doctor-content">
        <Box className="doctor-section">
          <Heading level="3" className="doctor-section-title">
            <FaClock />
            Available Time Slots
          </Heading>
          <Box className="doctor-form-fields">
            <Field label="Select a Time Slot">
              <Box className="doctor-table-wrapper">
                <DataTable table={slotTable}>
                  <DataTableBody />
                </DataTable>
              </Box>
            </Field>
            {selectedSlotSchedule && (
              <Box className="doctor-info-card">
                <Text className="doctor-info-label">Selected Slot</Text>
                <Text className="doctor-info-value">{getSelectedSlotSchedule()}</Text>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="doctor-section">
          <Heading level="3" className="doctor-section-title">
            <FaCalendarAlt />
            Appointment Details
          </Heading>
          <Box className="doctor-form-fields">
            <Field label="Select Date">
              <DateInput value={date} onValueChange={setDate} w="full" />
            </Field>
            {dateValidationError && (
              <Box className="doctor-validation-error">
                <FaExclamationTriangle />
                <Text>{dateValidationError}</Text>
              </Box>
            )}
            <Field label="Parent Appointment ID (Optional)">
              <Input
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                w="full"
                placeholder="Enter parent appointment ID if follow-up"
              />
            </Field>
            <Box className="doctor-actions">
              <Button
                appearance="inverse"
                disabled={!Boolean(selectedSlotSchedule) || !date || Boolean(dateValidationError)}
                onClick={getAppointments}
                className="doctor-button"
                icon={<FaClipboardList />}
              >
                View Appointments
              </Button>
              <Button
                appearance="primary"
                disabled={
                  !authCtx.isLoggedIn || !date || !Boolean(selectedSlotSchedule) || Boolean(dateValidationError)
                }
                onClick={makeAppointment}
                className="doctor-button"
                icon={<FaCalendarAlt />}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={appointments !== null} onOpenChange={(open) => setAppointments(open ? appointments : null)}>
        <DialogContent size="md">
          <DialogHeader>
            <Flex alignItems="center" gap="8">
              <FaClipboardList style={{ color: 'var(--color-primary)' }} />
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
