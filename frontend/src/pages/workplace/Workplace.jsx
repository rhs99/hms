import axios from 'axios';
import { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox, Text, Badge } from '@optiaxiom/react';
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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        disabled={!row.getCanSelect()}
      />
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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        disabled={!row.getCanSelect()}
      />
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

    const URL = Config.SERVER_URL + `/work-places/employees/${authCtx.getStoredValue().userId}`;
    axios.get(URL).then(({ data }) => {
      setWorkplaces(data);
    });
  }, [authCtx, navigate]);

  useEffect(() => {
    if (selectedSlotScheduleId) {
      getAllAppointments();
    }
  }, [selectedSlotScheduleId]);

  const getAllAppointments = async () => {
    if (!selectedSlotScheduleId) return;

    const PENDING_URL = `${Config.SERVER_URL}/appointments/slot-schedules/${selectedSlotScheduleId}?date=${utils.getFormatedDate(new Date())}&pending=True`;
    const RESOLVED_URL = `${Config.SERVER_URL}/appointments/slot-schedules/${selectedSlotScheduleId}?date=${utils.getFormatedDate(new Date())}&pending=False`;

    const [pendingResponse, resolvedResponse] = await Promise.all([axios.get(PENDING_URL), axios.get(RESOLVED_URL)]);

    setPendingAppointments(pendingResponse.data);
    setResolvedAppointments(resolvedResponse.data);
  };

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
  }, [pendingRowSelection]);

  const currentDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()];
  const filteredWorkplaces = useMemo(() => workplaces.filter((wp) => wp.day === currentDay), [workplaces, currentDay]);

  const workplaceTable = useReactTable({
    columns: getWorkplaceColumns(),
    data: filteredWorkplaces,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setWorkplaceRowSelection,
    state: {
      rowSelection: workplaceRowSelection,
    },
  });

  const pendingAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: pendingAppointments,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setPendingRowSelection,
    state: {
      rowSelection: pendingRowSelection,
    },
  });

  const resolvedAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: resolvedAppointments,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <Flex flexDirection="column" gap="16" className="workplace">
      <Text>My Workplaces</Text>
      <DataTable maxH="xs" table={workplaceTable}>
        <DataTableBody />
      </DataTable>

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

      {pendingAppointments.length > 0 ? (
        <>
          <Text>Pending Appointments</Text>
          <DataTable maxH="xs" w="fit" table={pendingAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </>
      ) : Object.keys(workplaceRowSelection).length > 0 ? (
        <Text color="fg.tertiary">No Pending Appointments</Text>
      ) : null}

      {resolvedAppointments.length > 0 ? (
        <>
          <Text>Resolved Appointments</Text>
          <DataTable maxH="xs" w="fit" table={resolvedAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </>
      ) : Object.keys(workplaceRowSelection).length > 0 ? (
        <Text color="fg.tertiary">No Resolved Appointments</Text>
      ) : null}
    </Flex>
  );
};

export default Workplace;
