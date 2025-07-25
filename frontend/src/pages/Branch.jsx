import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Config from '../config';

const columnHelper = createColumnHelper();

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [deptRowSelection, setDeptRowSelection] = useState({});
  const [doctorRowSelection, setDoctorRowSelection] = useState({});

  const { branchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts?branch_id=${branchId}`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  }, [branchId]);

  useEffect(() => {
    const selectedIds = Object.keys(deptRowSelection);
    if (selectedIds.length > 0) {
      const selectedDeptId = selectedIds[0];
      setSelectedDeptId(selectedDeptId);
      setDoctorRowSelection({});
      const url = Config.SERVER_URL + `/branch-depts/doctors?branch_id=${branchId}&dept_id=${selectedDeptId}`;
      axios.get(url).then(({ data }) => {
        setDoctors(data);
      });
    } else {
      setSelectedDeptId(null);
      setDoctors([]);
      setDoctorRowSelection({});
    }
  }, [deptRowSelection, branchId]);

  useEffect(() => {
    if (!selectedDeptId) return;
    const selectedIds = Object.keys(doctorRowSelection);
    if (selectedIds.length > 0) {
      const selectedDoctorId = selectedIds[0];
      navigate(`/branches/${branchId}/departments/${selectedDeptId}/doctors/${selectedDoctorId}`);
    }
  }, [doctorRowSelection, selectedDeptId, branchId, navigate]);

  const deptColumns = useMemo(
    () => [
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
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
    ],
    []
  );

  const deptData = useMemo(
    () =>
      depts.map((dept) => ({
        id: dept.id,
        name: dept.name,
      })),
    [depts]
  );

  const deptTable = useReactTable({
    columns: deptColumns,
    data: deptData,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setDeptRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection: deptRowSelection,
    },
  });

  const doctorColumns = useMemo(
    () => [
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
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor('degree', {
        id: 'degree',
        header: 'Degree',
      }),
      columnHelper.accessor('experience', {
        id: 'experience',
        header: 'Experience',
      }),
    ],
    []
  );

  const doctorData = useMemo(
    () =>
      doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        degree: doctor.degree,
        experience: doctor.experience,
      })),
    [doctors]
  );

  const doctorTable = useReactTable({
    columns: doctorColumns,
    data: doctorData,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setDoctorRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection: doctorRowSelection,
    },
  });

  return (
    <Flex gap="32" style={{ display: 'flex' }}>
      <div style={{ minWidth: '300px' }}>
        <DataTable maxH="xs" maxW="full" table={deptTable}>
          <DataTableBody />
        </DataTable>
      </div>
      {selectedDeptId && (
        <div style={{ minWidth: '400px' }}>
          <DataTable maxH="xs" maxW="full" table={doctorTable}>
            <DataTableBody />
          </DataTable>
        </div>
      )}
    </Flex>
  );
};

export default Branch;
