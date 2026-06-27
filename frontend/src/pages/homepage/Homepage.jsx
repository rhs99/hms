import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Text, Heading, DataTable, DataTableBody, DataTableCheckbox, Cover } from '@optiaxiom/react';
import { FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { CiLocationOn } from 'react-icons/ci';

import { SearchInput } from '@optiaxiom/react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Config from '../../config';

const columnHelper = createColumnHelper();

const Homepage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalRowSelection, setHospitalRowSelection] = useState({});
  const [branchRowSelection, setBranchRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const hospitalColumns = useMemo(
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
      columnHelper.accessor('id', {
        header: 'ID',
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Hospital Name',
      }),
    ],
    []
  );

  const branchColumns = useMemo(
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
      columnHelper.accessor('id', {
        header: 'Branch ID',
        size: 100,
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => (
          <Flex flexDirection="row" alignItems="center" gap="8">
            <CiLocationOn />
            <Text truncate>{info.getValue()}</Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => (
          <Flex flexDirection="row" alignItems="center" gap="8">
            <FaPhone />
            <Text>{info.getValue()}</Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
          <Flex flexDirection="row" alignItems="center" gap="8">
            <MdOutlineEmail />
            <Text fontSize="sm">{info.getValue()}</Text>
          </Flex>
        ),
      }),
    ],
    []
  );

  const filteredHospitals = useMemo(() => {
    if (!searchTerm) return hospitals;
    return hospitals.filter((h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, hospitals]);

  const hospitalTable = useReactTable({
    columns: hospitalColumns,
    data: filteredHospitals,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setHospitalRowSelection,
    state: {
      rowSelection: hospitalRowSelection,
    },
  });

  const branchTable = useReactTable({
    columns: branchColumns,
    data: branches,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: false,
    onRowSelectionChange: setBranchRowSelection,
    state: {
      rowSelection: branchRowSelection,
    },
  });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data } = await axios.get(`${Config.SERVER_URL}/hospitals`);
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    const selectedRows = hospitalTable.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const hospital = selectedRows[0].original;
      setSelectedHospital(hospital);

      const fetchBranches = async () => {
        try {
          const { data } = await axios.get(`${Config.SERVER_URL}/branches?hospital_id=${hospital.id}`);
          setBranches(data);
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      };
      fetchBranches();
    } else {
      setSelectedHospital(null);
      setBranches([]);
      setBranchRowSelection({});
    }
  }, [hospitalRowSelection, hospitalTable]);

  useEffect(() => {
    const selectedRows = branchTable.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const branch = selectedRows[0].original;
      navigate(`/branches/${branch.id}`);
    }
  }, [branchRowSelection, branchTable, navigate]);

  return (
    <Flex
      flexDirection="column"
      gap="16"
      style={{ maxHeight: '80vh', overflowY: 'auto', padding: 'var(--spacing-lg)' }}
    >
      <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
        <SearchInput
          placeholder="Search hospitals"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          w="224"
        />
      </Flex>

      <Flex flexDirection="row" gap="16">
        <Flex flexDirection="column" gap="8" style={{ flexBasis: '400px', flexShrink: 0, minWidth: '0' }}>
          <Heading level="4">Hospitals</Heading>
          {filteredHospitals.length === 0 ? (
            <Box p="16">
              <Text>{searchTerm ? 'No hospitals found matching your search.' : 'No hospitals available.'}</Text>
            </Box>
          ) : (
            <DataTable maxH="lg" table={hospitalTable}>
              <DataTableBody />
            </DataTable>
          )}
        </Flex>

        {selectedHospital && (
          <Flex flexDirection="column" gap="8" style={{ flex: '1', minWidth: '0' }}>
            <Heading level="4">Branches - {selectedHospital.name}</Heading>
            {branches.length === 0 ? (
              <Box p="16">
                <Text>No branches available for this hospital.</Text>
              </Box>
            ) : (
              <DataTable maxH="lg" table={branchTable}>
                <DataTableBody />
              </DataTable>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Homepage;
