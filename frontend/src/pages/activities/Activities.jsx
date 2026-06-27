import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FaCalendarCheck, FaHistory, FaClipboardList } from 'react-icons/fa';
import {
  Box,
  Cover,
  DataTable,
  DataTableBody,
  DataTableCheckbox,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Flex,
  Heading,
  Text,
} from '@optiaxiom/react';

import Prescription from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

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
  columnHelper.accessor('serial_no', { header: 'SL No', size: 80 }),
  columnHelper.accessor('id', { header: 'Id', size: 100 }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('parent', {
    header: 'Previous Appointment',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('hospital', { header: 'Hospital' }),
  columnHelper.accessor('branch', { header: 'Branch' }),
  columnHelper.accessor('department', { header: 'Department' }),
  columnHelper.accessor('doctor', { header: 'Doctor' }),
  columnHelper.accessor('time', { header: 'Time' }),
];

const Section = ({ icon, title, isEmpty, emptyLabel, children }) => (
  <Box
    bg="bg.default"
    rounded="xl"
    border="1"
    borderColor="border.secondary"
    shadow="sm"
    p="20"
  >
    <Flex
      flexDirection="row"
      alignItems="center"
      gap="8"
      pb="12"
      borderColor="border.tertiary"
      style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', marginBottom: '16px' }}
    >
      <Box color="fg.accent.strong" style={{ fontSize: '18px', display: 'flex' }}>
        {icon}
      </Box>
      <Heading level="4" color="fg.default">
        {title}
      </Heading>
    </Flex>
    {isEmpty ? (
      <Box
        p="32"
        bg="bg.page"
        rounded="md"
        border="1"
        borderColor="border.secondary"
        style={{ borderStyle: 'dashed', textAlign: 'center' }}
      >
        <Text color="fg.tertiary">{emptyLabel}</Text>
      </Box>
    ) : (
      children
    )}
  </Box>
);

const Activities = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [pastRowSelection, setPastRowSelection] = useState({});

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    const userId = authCtx.getStoredValue().userId;
    const UPCOMING_URL = Config.SERVER_URL + `/users/${userId}/appointments`;
    const PAST_URL = Config.SERVER_URL + `/users/${userId}/appointments?past=True`;

    const [upcomingResponse, pastResponse] = await Promise.all([axios.get(UPCOMING_URL), axios.get(PAST_URL)]);

    setUpcomingAppointments(upcomingResponse.data);
    setPastAppointments(pastResponse.data);
  }, [authCtx]);

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate('/sign-in');
      return;
    }
    fetchAppointments().catch((e) => console.log(e));
  }, [authCtx, navigate, fetchAppointments]);

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
  }, [pastRowSelection, pastAppointments]);

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
    state: { rowSelection: pastRowSelection },
  });

  const closePrescriptionDialog = () => {
    setAppointmentToView(null);
    setPastRowSelection({});
  };

  if (!authCtx.isLoggedIn) return null;

  return (
    <Box bg="bg.page" p="24" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        p="20"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '24px' }}
      >
        <Flex flexDirection="row" alignItems="center" gap="16">
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.accent.subtle"
            color="fg.accent.strong"
            rounded="lg"
            style={{ width: '48px', height: '48px', fontSize: '24px' }}
          >
            <FaClipboardList />
          </Flex>
          <Flex flexDirection="column" gap="2">
            <Heading level="2" color="fg.default">
              My Activities
            </Heading>
            <Text fontSize="sm" color="fg.tertiary">
              View your upcoming and past appointments
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {appointmentToView && (
        <Dialog open={!!appointmentToView} onOpenChange={closePrescriptionDialog}>
          <DialogContent size="lg">
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

      <Flex flexDirection="column" gap="20">
        <Section
          icon={<FaCalendarCheck />}
          title="Upcoming Appointments"
          isEmpty={upcomingAppointments.length === 0}
          emptyLabel="No upcoming appointments"
        >
          <DataTable table={upcomingAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </Section>

        <Section
          icon={<FaHistory />}
          title="Past Appointments"
          isEmpty={pastAppointments.length === 0}
          emptyLabel="No past appointments"
        >
          <DataTable table={pastAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </Section>
      </Flex>
    </Box>
  );
};

export default Activities;
