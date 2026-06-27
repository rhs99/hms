import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { FaCalendarCheck, FaHistory, FaClipboardList } from 'react-icons/fa';
import { DataTable, DataTableBody, Box, Cover, DataTableCheckbox, Heading, Text } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';

import Prescription from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

import './_index.scss';

const columnHelper = createColumnHelper();

const getAppointmentColumns = () => [
  {
    id: 'select',
    size: 50,
    cell: () => (
      <Cover asChild>
        <DataTableCheckbox />
      </Cover>
    ),
  },
  columnHelper.accessor('serial_no', {
    header: 'SL No',
    size: 80,
  }),
  columnHelper.accessor('id', {
    header: 'Id',
    size: 100,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
  }),
  columnHelper.accessor('parent', {
    header: 'Previous Appointment',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('hospital', {
    header: 'Hospital',
  }),
  columnHelper.accessor('branch', {
    header: 'Branch',
  }),
  columnHelper.accessor('department', {
    header: 'Department',
  }),
  columnHelper.accessor('doctor', {
    header: 'Doctor',
  }),
  columnHelper.accessor('time', {
    header: 'Time',
  }),
];

const Activities = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [pastRowSelection, setPastRowSelection] = useState({});

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const UPCOMING_URL = Config.SERVER_URL + `/users/${authCtx.getStoredValue().userId}/appointments`;
    const PAST_URL = Config.SERVER_URL + `/users/${authCtx.getStoredValue().userId}/appointments?past=True`;

    const [upcomingResponse, pastResponse] = await Promise.all([axios.get(UPCOMING_URL), axios.get(PAST_URL)]);

    setUpcomingAppointments(upcomingResponse.data);
    setPastAppointments(pastResponse.data);
  };

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate('/sign-in');
      return;
    }
    fetchAppointments().catch((e) => console.log(e));
  }, [authCtx, navigate]);

  const getAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    const { data } = await axios.get(URL);
    setAppointmentToView(data);
  };

  useEffect(() => {
    const selectedIds = Object.keys(pastRowSelection);
    if (selectedIds.length > 0) {
      const selectedAppointment = pastAppointments.find((_, index) => pastRowSelection[index]);
      if (selectedAppointment) {
        getAppointment(selectedAppointment.id);
      }
    }
  }, [pastRowSelection]);

  const upcomingAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: upcomingAppointments,
    getCoreRowModel: getCoreRowModel(),
  });

  const pastAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: pastAppointments,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setPastRowSelection,
    state: {
      rowSelection: pastRowSelection,
    },
  });

  const closePrescriptionDialog = () => {
    setAppointmentToView(null);
    setPastRowSelection({});
  };

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <Box className="activities">
      <Box className="activities-header">
        <Heading level="2" className="activities-title">
          <FaClipboardList size={32} />
          My Activities
        </Heading>
        <Text className="activities-subtitle">View your upcoming and past appointments</Text>
      </Box>

      {appointmentToView && (
        <Dialog open={!!appointmentToView} onOpenChange={closePrescriptionDialog}>
          <DialogContent>
            <DialogHeader>
              <Heading level="3">Appointment Details</Heading>
            </DialogHeader>
            <DialogBody>
              <Prescription data={appointmentToView} viewOnly={true} />
            </DialogBody>
            <DialogFooter>
              <DialogClose appearance="primary" onClick={closePrescriptionDialog}>
                Close
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Box className="activities-content">
        <Box className="activities-section">
          <Box className="activities-section-header">
            <Heading level="3" className="activities-section-title">
              <FaCalendarCheck />
              Upcoming Appointments
            </Heading>
          </Box>
          {upcomingAppointments.length > 0 ? (
            <Box className="activities-table-wrapper">
              <DataTable table={upcomingAppointmentsTable}>
                <DataTableBody />
              </DataTable>
            </Box>
          ) : (
            <Box className="activities-empty-state">
              <Text>No upcoming appointments</Text>
            </Box>
          )}
        </Box>

        <Box className="activities-section">
          <Box className="activities-section-header">
            <Heading level="3" className="activities-section-title">
              <FaHistory />
              Past Appointments
            </Heading>
          </Box>
          {pastAppointments.length > 0 ? (
            <Box className="activities-table-wrapper">
              <DataTable table={pastAppointmentsTable}>
                <DataTableBody />
              </DataTable>
            </Box>
          ) : (
            <Box className="activities-empty-state">
              <Text>No past appointments</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Activities;
