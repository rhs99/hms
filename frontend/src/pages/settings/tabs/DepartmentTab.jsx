import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Box, Button, DataTable, DataTableBody, Field, Flex, Input, Text } from '@optiaxiom/react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FaPlus, FaStethoscope, FaList } from 'react-icons/fa';

import Config from '../../../config';
import { Card, CardBody, CardHeader, StatusMessage } from '../_components';

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
    <Flex flexDirection="column" gap="20">
      <Card>
        <CardHeader
          icon={<FaStethoscope />}
          title="Add New Department"
          subtitle="Create a clinical department"
        />
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Flex flexDirection="column" gap="16">
              <Field label="Department Name" required>
                <Input
                  placeholder="Enter department name"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  required
                />
              </Field>
              <Flex flexDirection="row" gap="16" alignItems="center">
                <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                  {isLoading ? 'Creating...' : 'Create Department'}
                </Button>
                <StatusMessage tone="success">{successMessage}</StatusMessage>
              </Flex>
            </Flex>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<FaList />}
          title="Existing Departments"
          subtitle={`${departments.length} ${departments.length === 1 ? 'department' : 'departments'} configured`}
        />
        <CardBody>
          {departments.length === 0 ? (
            <Box p="16" bg="bg.secondary" rounded="md">
              <Text color="fg.tertiary">No departments created yet.</Text>
            </Box>
          ) : (
            <DataTable table={table}>
              <DataTableBody />
            </DataTable>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default DepartmentTab;
