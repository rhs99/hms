import axios from 'axios';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { FaBriefcaseMedical, FaClock, FaUserClock, FaCheckCircle } from 'react-icons/fa';
import { Badge, Box, Cover, DataTable, DataTableBody, DataTableCheckbox, Flex, Heading, Text } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import utils from '../../utils';
import Prescreption from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

const columnHelper = createColumnHelper();

const getWorkplaceColumns = () => [
  {
    id: 'select',
    size: 50,
    cell: () => (
      <Cover asChild>
        <DataTableCheckbox />
      </Cover>
    ),
  },
  columnHelper.accessor('hospital', {
    header: 'Hospital',
  }),
  columnHelper.accessor('branch', {
    header: 'Branch',
  }),
  columnHelper.accessor('day', {
    header: 'Day',
  }),
  columnHelper.accessor('start_at', {
    header: 'Starting At',
  }),
  columnHelper.accessor('end_at', {
    header: 'Ending At',
  }),
];

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
  columnHelper.accessor('full_name', {
    header: 'Patient',
    size: 150,
    maxSize: 300,
    enableResizing: true,
    cell: (info) => <Text truncate>{info.getValue() || 'N/A'}</Text>,
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
    size: 100,
    cell: (info) => <Badge intent="information">{info.getValue() || 'N/A'}</Badge>,
  }),
  columnHelper.accessor('parent', {
    header: 'Previous Appointment',
    size: 180,
    cell: (info) => <Text>{info.getValue() || 'N/A'}</Text>,
  }),
];

const Workplace = () => {
  const [workplaces, setWorkplaces] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [resolvedAppointments, setResolvedAppointments] = useState([]);
  const [appointmentToResolve, setAppointmentToResolve] = useState(null);
  const [selectedSlotScheduleId, setSelectedSlotScheduleId] = useState(null);
  const [workplaceRowSelection, setWorkplaceRowSelection] = useState({});
  const [pendingRowSelection, setPendingRowSelection] = useState({});

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      navigate('/');
      return;
    }

    const URL = Config.SERVER_URL + `/employees/${authCtx.getStoredValue().userId}/work-places`;
    axios.get(URL).then(({ data }) => {
      setWorkplaces(data);
    });
  }, [authCtx, navigate]);

  const getAllAppointments = useCallback(async () => {
    if (!selectedSlotScheduleId) return;

    const PENDING_URL = `${Config.SERVER_URL}/slot-schedules/${selectedSlotScheduleId}/appointments?date=${utils.getFormatedDate(new Date())}&pending=True`;
    const RESOLVED_URL = `${Config.SERVER_URL}/slot-schedules/${selectedSlotScheduleId}/appointments?date=${utils.getFormatedDate(new Date())}&pending=False`;

    const [pendingResponse, resolvedResponse] = await Promise.all([axios.get(PENDING_URL), axios.get(RESOLVED_URL)]);

    setPendingAppointments(pendingResponse.data);
    setResolvedAppointments(resolvedResponse.data);
  }, [selectedSlotScheduleId]);

  useEffect(() => {
    if (selectedSlotScheduleId) {
      getAllAppointments();
    }
  }, [selectedSlotScheduleId, getAllAppointments]);

  const resolveAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    const { data } = await axios.get(URL);
    setAppointmentToResolve(data);
  };

  useEffect(() => {
    const selectedIds = Object.keys(workplaceRowSelection);
    if (selectedIds.length > 0) {
      const selectedWorkplace = workplaces.find((workplace, index) => workplaceRowSelection[index]);
      if (selectedWorkplace) {
        setSelectedSlotScheduleId(selectedWorkplace.slot_schedule_id);
      }
    }
  }, [workplaceRowSelection, workplaces]);

  useEffect(() => {
    const selectedIds = Object.keys(pendingRowSelection);
    if (selectedIds.length > 0) {
      const selectedAppointment = pendingAppointments.find((_, index) => pendingRowSelection[index]);
      if (selectedAppointment) {
        resolveAppointment(selectedAppointment.id);
      }
    }
  }, [pendingRowSelection, pendingAppointments]);

  const currentDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()];
  const filteredWorkplaces = useMemo(() => workplaces.filter((wp) => wp.day === currentDay), [workplaces, currentDay]);

  const workplaceTable = useReactTable({
    columns: getWorkplaceColumns(),
    data: filteredWorkplaces,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setWorkplaceRowSelection,
    state: { rowSelection: workplaceRowSelection },
  });

  const pendingAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: pendingAppointments,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setPendingRowSelection,
    state: { rowSelection: pendingRowSelection },
  });

  const resolvedAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: resolvedAppointments,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!authCtx.isLoggedIn) {
    return null;
  }

  const Section = ({ icon, title, isEmpty, emptyLabel, children }) => (
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
          {icon}
        </Box>
        <Heading level="4" color="fg.default">
          {title}
        </Heading>
      </Flex>
      {isEmpty ? (
        <Box
          p="24"
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
          <FaBriefcaseMedical />
        </Flex>
        <Flex flexDirection="column" gap="2">
          <Heading level="2" color="fg.default">
            My Workplace
          </Heading>
          <Text fontSize="sm" color="fg.tertiary">
            Manage your workplaces and appointments
          </Text>
        </Flex>
      </Flex>

      <Flex flexDirection="column" gap="20">
        <Section
          icon={<FaClock />}
          title="Today's Workplaces"
          isEmpty={filteredWorkplaces.length === 0}
          emptyLabel="No workplaces scheduled for today"
        >
          <DataTable maxH="xs" table={workplaceTable}>
            <DataTableBody />
          </DataTable>
        </Section>

        {appointmentToResolve && (
          <Prescreption
            data={appointmentToResolve}
            onUpdate={async () => {
              setAppointmentToResolve(null);
              await getAllAppointments();
            }}
            onCancel={() => {
              setAppointmentToResolve(null);
              setPendingRowSelection({});
            }}
          />
        )}

        {Object.keys(workplaceRowSelection).length > 0 && (
          <>
            <Section
              icon={<FaUserClock />}
              title="Pending Appointments"
              isEmpty={pendingAppointments.length === 0}
              emptyLabel="No pending appointments for today"
            >
              <DataTable maxH="xs" w="fit" table={pendingAppointmentsTable}>
                <DataTableBody />
              </DataTable>
            </Section>

            <Section
              icon={<FaCheckCircle />}
              title="Resolved Appointments"
              isEmpty={resolvedAppointments.length === 0}
              emptyLabel="No resolved appointments for today"
            >
              <DataTable maxH="xs" w="fit" table={resolvedAppointmentsTable}>
                <DataTableBody />
              </DataTable>
            </Section>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Workplace;
