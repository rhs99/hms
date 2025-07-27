import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, DataTableBody, Flex, Checkbox, Button, Text } from '@optiaxiom/react';

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';

import Config from '../../config';

const DepartmentAssociationModal = ({ open, onClose, branchId, branchDepartments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [departmentRowSelection, setDepartmentRowSelection] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const url = Config.SERVER_URL + `/departments`;
    axios.get(url).then(({ data }) => {
      setAllDepartments(data);
      setIsLoading(false);
    });
  }, []);

  const handleAddDepartment = () => {
    const selectedRows = departmentTable.getSelectedRowModel().rows;
    const selectedDepartmentIds = selectedRows.map((row) => row.original.id);
    if (selectedDepartmentIds.length === 0) {
      return;
    }
    const url = Config.SERVER_URL + `/branch-depts`;
    const data = {
      branch_id: branchId,
      dept_id: selectedDepartmentIds[0],
    };
    axios.post(url, data).then(() => {
      onClose();
    });
  };

  const columnHelper = createColumnHelper();
  const departmentColumns = useMemo(
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
        header: 'Department Name',
      }),
    ],
    []
  );

  const departmentTable = useReactTable({
    columns: departmentColumns,
    data: useMemo(
      () => allDepartments.filter((dept) => !branchDepartments.some((bd) => bd.id === dept.id)),
      [allDepartments, branchDepartments]
    ),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setDepartmentRowSelection,
    enableMultiRowSelection: false,
    getRowId: (row) => row.id,
    state: {
      rowSelection: departmentRowSelection,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Associate Department</DialogHeader>
        <DialogBody>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <DataTable table={departmentTable}>
              <DataTableBody />
            </DataTable>
          )}
        </DialogBody>
        <DialogFooter>
          <Flex flexDirection="row" gap="8">
            <Button appearance="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={Object.keys(departmentRowSelection).length === 0}
              appearance="primary"
              onClick={handleAddDepartment}
            >
              Associate
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentAssociationModal;
