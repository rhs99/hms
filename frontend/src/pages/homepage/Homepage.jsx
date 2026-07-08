import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Box,
  Button,
  DataTable,
  DataTableAction,
  DataTableBody,
  DataTableFooter,
  DataTableLabel,
  Flex,
  Heading,
  Link,
  Menu,
  MenuContent,
  MenuTrigger,
  SearchInput,
  Text,
} from '@optiaxiom/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaPhone, FaMapMarkedAlt } from 'react-icons/fa';
import { MdOutlineEmail, MdLocationOn } from 'react-icons/md';

import Config from '../../config';
import { AlertBanner } from '../../component/alerts';
import { useAlertState } from '../../component/useAlertState';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.display({
    id: 'hospital',
    header: 'Hospital',
    cell: ({ row }) => (
      <DataTableLabel asChild>
        <DataTableAction flex="initial" overflow="hidden" primary>
          <Link asChild appearance="subtle">
            <RouterLink to={`/branches/${row.original.id}`}>
              <Text truncate>{row.original.hospital?.name || 'N/A'}</Text>
            </RouterLink>
          </Link>
        </DataTableAction>
      </DataTableLabel>
    ),
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: (info) => (
      <Flex flexDirection="row" alignItems="center" gap="8" color="fg.tertiary">
        <MdLocationOn />
        <Text fontSize="sm" color="fg.default" truncate>
          {info.getValue()}
        </Text>
      </Flex>
    ),
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: (info) => (
      <Flex flexDirection="row" alignItems="center" gap="8" color="fg.tertiary">
        <FaPhone />
        <Text fontSize="sm" color="fg.default">
          {info.getValue() || '—'}
        </Text>
      </Flex>
    ),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => (
      <Flex flexDirection="row" alignItems="center" gap="8" color="fg.tertiary">
        <MdOutlineEmail />
        <Text fontSize="sm" color="fg.default" truncate>
          {info.getValue() || '—'}
        </Text>
      </Flex>
    ),
  }),
];

const Homepage = () => {
  const { alert, show, dismiss } = useAlertState();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);

  const [data, setData] = useState({ items: [], total: 0 });
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch, selectedDivision, selectedDistrict, selectedThana]);

  useEffect(() => {
    axios
      .get(`${Config.SERVER_URL}/divisions`)
      .then(({ data }) => setDivisions(data))
      .catch(() => show('danger', 'Failed to load divisions.'));
  }, [show]);

  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      setSelectedDistrict(null);
      return;
    }
    axios
      .get(`${Config.SERVER_URL}/districts?division_id=${selectedDivision.id}`)
      .then(({ data }) => setDistricts(data))
      .catch(() => show('danger', 'Failed to load districts.'));
  }, [selectedDivision, show]);

  useEffect(() => {
    if (!selectedDistrict) {
      setThanas([]);
      setSelectedThana(null);
      return;
    }
    axios
      .get(`${Config.SERVER_URL}/thanas?district_id=${selectedDistrict.id}`)
      .then(({ data }) => setThanas(data))
      .catch(() => show('danger', 'Failed to load thanas.'));
  }, [selectedDistrict, show]);

  const fetchBranches = useCallback(async () => {
    const params = new URLSearchParams();
    params.set('limit', pagination.pageSize);
    params.set('offset', pagination.pageIndex * pagination.pageSize);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedThana) params.set('thana_id', selectedThana.id);
    else if (selectedDistrict) params.set('district_id', selectedDistrict.id);
    else if (selectedDivision) params.set('division_id', selectedDivision.id);

    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/branches?${params.toString()}`);
      setData({ items: data.items, total: data.total });
    } catch {
      show('danger', 'Failed to load branches.');
    }
  }, [pagination, debouncedSearch, selectedDivision, selectedDistrict, selectedThana, show]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const table = useReactTable({
    data: useMemo(() => data.items, [data.items]),
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: data.total,
    state: { pagination },
    enableColumnResizing: true,
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedThana(null);
  };

  const hasActiveFilter = Boolean(debouncedSearch) || selectedDivision || selectedDistrict || selectedThana;

  return (
    <Box bg="bg.page" p="16" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      <AlertBanner alert={alert} onDismiss={dismiss} />

      <Flex
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        gap="12"
        p="16"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '16px' }}
      >
        <Flex flexDirection="row" alignItems="center" gap="12">
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.accent.subtle"
            color="fg.accent.strong"
            rounded="lg"
            style={{ width: '40px', height: '40px', fontSize: '20px' }}
          >
            <FaMapMarkedAlt />
          </Flex>
          <Flex flexDirection="column" gap="2">
            <Heading level="3" color="fg.default">
              Find a Hospital
            </Heading>
            <Text fontSize="sm" color="fg.tertiary">
              {data.total} {data.total === 1 ? 'hospital' : 'hospitals'}
              {hasActiveFilter ? ' match your filters' : ' total'}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        flexDirection="row"
        flexWrap="wrap"
        gap="12"
        p="16"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '16px' }}
      >
        <SearchInput
          placeholder="Search hospital or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '2 1 240px' }}
        />
        <Menu
          options={[
            { label: 'All divisions', execute: () => setSelectedDivision(null) },
            ...divisions.map((d) => ({ label: d.name, execute: () => setSelectedDivision(d) })),
          ]}
        >
          <MenuTrigger style={{ flex: '1 1 160px' }}>
            {selectedDivision ? selectedDivision.name : 'All divisions'}
          </MenuTrigger>
          <MenuContent />
        </Menu>
        <Menu
          options={[
            { label: 'All districts', execute: () => setSelectedDistrict(null) },
            ...districts.map((d) => ({ label: d.name, execute: () => setSelectedDistrict(d) })),
          ]}
        >
          <MenuTrigger style={{ flex: '1 1 160px' }} disabled={!selectedDivision}>
            {selectedDistrict ? selectedDistrict.name : 'All districts'}
          </MenuTrigger>
          <MenuContent />
        </Menu>
        <Menu
          options={[
            { label: 'All thanas', execute: () => setSelectedThana(null) },
            ...thanas.map((t) => ({ label: t.name, execute: () => setSelectedThana(t) })),
          ]}
        >
          <MenuTrigger style={{ flex: '1 1 160px' }} disabled={!selectedDistrict}>
            {selectedThana ? selectedThana.name : 'All thanas'}
          </MenuTrigger>
          <MenuContent />
        </Menu>
        {hasActiveFilter && (
          <Button appearance="subtle" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </Flex>

      {data.items.length === 0 ? (
        <Box
          p="32"
          bg="bg.default"
          rounded="xl"
          border="1"
          borderColor="border.secondary"
          style={{ borderStyle: 'dashed', textAlign: 'center' }}
        >
          <Text color="fg.tertiary">
            {hasActiveFilter ? 'No branches match the current filters.' : 'No branches available.'}
          </Text>
        </Box>
      ) : (
        <Box
          bg="bg.default"
          rounded="xl"
          border="1"
          borderColor="border.secondary"
          shadow="sm"
          style={{ overflow: 'hidden' }}
        >
          <DataTable table={table}>
            <DataTableBody />
            <DataTableFooter />
          </DataTable>
        </Box>
      )}
    </Box>
  );
};

export default Homepage;
