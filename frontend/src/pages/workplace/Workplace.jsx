import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, flexRender } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import utils from '../../utils';
import Prescreption from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

const columnHelper = createColumnHelper();

const getWorkplaceColumns = (table) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')}
        onChange={table.getToggleAllRowsSelectedHandler()}
        indeterminate={table.getIsSomeRowsSelected()}
      />
    ),
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

const getAppointmentColumns = (table) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')}
        onChange={table.getToggleAllRowsSelectedHandler()}
        indeterminate={table.getIsSomeRowsSelected()}
      />
    ),
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
  }),
  columnHelper.accessor('parent', {
    header: 'Parent',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('full_name', {
    header: 'Patient',
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
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
  const [resolvedRowSelection, setResolvedRowSelection] = useState({});

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

  const workplaceTable = useReactTable({
    columns: getWorkplaceColumns(),
    data: workplaces,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setWorkplaceRowSelection,
    state: {
      rowSelection: workplaceRowSelection,
    },
  });

  const pendingAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: pendingAppointments,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setPendingRowSelection,
    state: {
      rowSelection: pendingRowSelection,
    },
  });

  const resolvedAppointmentsTable = useReactTable({
    columns: getAppointmentColumns(),
    data: resolvedAppointments,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setResolvedRowSelection,
    state: {
      rowSelection: resolvedRowSelection,
    },
  });

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <Flex flexDirection="column" gap="16" className="workplace">
      <h2>My Workplaces</h2>
      <DataTable table={workplaceTable}>
        <DataTableBody />
      </DataTable>

      {appointmentToResolve && (
        <Prescreption
          data={appointmentToResolve}
          onUpdate={async () => {
            setAppointmentToResolve(null);
            await getAllAppointments();
          }}
          onCancel={() => setAppointmentToResolve(null)}
        />
      )}

      {pendingAppointments.length > 0 && (
        <>
          <h2>Pending Appointments</h2>
          <DataTable table={pendingAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </>
      )}

      {resolvedAppointments.length > 0 && (
        <>
          <h2>Resolved Appointments</h2>
          <DataTable table={resolvedAppointmentsTable}>
            <DataTableBody />
          </DataTable>
        </>
      )}
    </Flex>
  );
};

export default Workplace;
