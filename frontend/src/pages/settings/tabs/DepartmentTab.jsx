import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box, Button, Field, Input, Heading, Text, Flex } from '@optiaxiom/react';
import { DataTable, DataTableBody } from '@optiaxiom/react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';

const columnHelper = createColumnHelper();

const DepartmentTab = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/departments`);
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      await axios.post(`${Config.SERVER_URL}/departments`, {
        name: departmentName,
      });

      setDepartmentName('');
      setSuccessMessage('Department created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Department Name',
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: departments,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box className="settings-tab">
      <Box className="settings-tab-form">
        <Heading level="3">Add New Department</Heading>
        <form onSubmit={handleSubmit}>
          <Field label="Department Name" required>
            <Input
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </Field>
          <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
            <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
              {isLoading ? 'Creating...' : 'Create Department'}
            </Button>
            {successMessage && (
              <Flex alignItems="center" gap="8" style={{ color: 'var(--color-success)' }}>
                <FaCheckCircle />
                <Text>{successMessage}</Text>
              </Flex>
            )}
          </Flex>
        </form>
      </Box>

      <Box className="settings-tab-table">
        <Heading level="3">Existing Departments</Heading>
        {departments.length === 0 ? (
          <Text color="fg.tertiary">No departments created yet.</Text>
        ) : (
          <DataTable table={table}>
            <DataTableBody />
          </DataTable>
        )}
      </Box>
    </Box>
  );
};

export default DepartmentTab;
