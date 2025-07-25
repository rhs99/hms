import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox } from '@optiaxiom/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { SearchInput } from '@optiaxiom/react';
import Config from '../../config';

const columnHelper = createColumnHelper();

const Homepage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [matchedHospitals, setMatchedHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + '/hospitals';
    axios.get(url).then(({ data }) => {
      setHospitals(data);
      setMatchedHospitals(data);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setMatchedHospitals(hospitals);
    } else {
      const matched = hospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
      setMatchedHospitals(matched);
    }
  }, [searchTerm]);

  const columns = useMemo(
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
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor('address', {
        id: 'address',
        header: 'Address',
      }),
      columnHelper.accessor('phone', {
        id: 'phone',
        header: 'Phone',
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
        minSize: 200,
      }),
    ],
    []
  );

  const data = useMemo(
    () =>
      matchedHospitals.map((hospital) => ({
        id: `${hospital.name}-${hospital.branch_id}`,
        name: hospital.name,
        address: hospital.address,
        phone: hospital.phone,
        email: hospital.email,
        branch_id: hospital.branch_id,
      })),
    [matchedHospitals]
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length > 0) {
      const selectedRowId = selectedIds[0];
      const selectedRowIndex = table.getRowModel().rows.findIndex((row) => row.id === selectedRowId);
      if (selectedRowIndex !== -1) {
        const selectedHospital = data[selectedRowIndex];
        navigate(`/branches/${selectedHospital.branch_id}`);
      }
    }
  }, [rowSelection, data, table]);

  return (
    <Flex flexDirection="column" gap="16">
      <Flex flexDirection="row" justifyContent="flex-end" style={{ margin: '16px 0' }}>
        <SearchInput placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Flex>

      <DataTable maxH="xs" maxW="full" table={table}>
        <DataTableBody />
      </DataTable>
    </Flex>
  );
};

export default Homepage;
