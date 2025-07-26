import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@optiaxiom/react';

import Prescription from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

const columnHelper = createColumnHelper();

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
  }),
  columnHelper.accessor('id', {
    header: 'Id',
  }),
  columnHelper.accessor('date', {
    header: 'Date',
  }),
  columnHelper.accessor('parent', {
    header: 'Parent',
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
    const UPCOMING_URL = Config.SERVER_URL + `/appointments/users/${authCtx.getStoredValue().userId}`;
    const PAST_URL = Config.SERVER_URL + `/appointments/users/${authCtx.getStoredValue().userId}?past=True`;

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
    columns: getAppointmentColumns().filter((col) => col.id !== 'select'),
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
    <Flex flexDirection="column" gap="16">
      {appointmentToView && (
        <Dialog open={!!appointmentToView} onOpenChange={closePrescriptionDialog}>
          <DialogContent>
            <DialogHeader>
              <h2>Appointment Details</h2>
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

      <Flex flexDirection="column" gap="16">
        <h2>Upcoming Appointments</h2>
        <DataTable table={upcomingAppointmentsTable}>
          <DataTableBody />
        </DataTable>

        <h2>Past Appointments</h2>
        <DataTable table={pastAppointmentsTable}>
          <DataTableBody />
        </DataTable>
      </Flex>
    </Flex>
  );
};

export default Activities;
