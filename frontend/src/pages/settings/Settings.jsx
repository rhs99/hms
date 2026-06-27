import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Flex, Link, Text, Tabs, TabsList, TabsTrigger, TabsContent } from '@optiaxiom/react';
import {
  FaCog,
  FaHospital,
  FaBuilding,
  FaStethoscope,
  FaClock,
  FaUserMd,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaLock,
} from 'react-icons/fa';

import AuthContext from '../../store/auth';
import HospitalTab from './tabs/HospitalTab';
import BranchTab from './tabs/BranchTab';
import DepartmentTab from './tabs/DepartmentTab';
import SlotTab from './tabs/SlotTab';
import DoctorTab from './tabs/DoctorTab';
import ScheduleTab from './tabs/ScheduleTab';
import RegionTab from './tabs/RegionTab';

const TABS = [
  { value: 'hospitals', label: 'Hospitals', icon: <FaHospital />, Component: HospitalTab },
  { value: 'regions', label: 'Regions', icon: <FaMapMarkedAlt />, Component: RegionTab },
  { value: 'branches', label: 'Branches', icon: <FaBuilding />, Component: BranchTab },
  { value: 'departments', label: 'Departments', icon: <FaStethoscope />, Component: DepartmentTab },
  { value: 'slots', label: 'Time Slots', icon: <FaClock />, Component: SlotTab },
  { value: 'doctors', label: 'Doctors', icon: <FaUserMd />, Component: DoctorTab },
  { value: 'schedules', label: 'Doctor Schedules', icon: <FaCalendarAlt />, Component: ScheduleTab },
];

const Settings = () => {
  const { isAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('hospitals');

  if (!isAdmin) {
    return (
      <Box bg="bg.page" p="16" style={{ minHeight: '85vh' }}>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="16"
          p="32"
          bg="bg.default"
          rounded="xl"
          border="1"
          borderColor="border.secondary"
          shadow="sm"
          style={{ maxWidth: '480px', margin: '64px auto', textAlign: 'center' }}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.danger.subtle"
            color="fg.danger.strong"
            rounded="lg"
            style={{ width: '48px', height: '48px', fontSize: '24px' }}
          >
            <FaLock />
          </Flex>
          <Heading level="3" color="fg.default">
            Admins only
          </Heading>
          <Text color="fg.tertiary">
            Settings are restricted to administrators. Contact an admin if you need access.
          </Text>
          <Link asChild>
            <RouterLink to="/">Back to home</RouterLink>
          </Link>
        </Flex>
      </Box>
    );
  }

  return (
    <Box bg="bg.page" p="16" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
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
        style={{ marginBottom: '20px' }}
      >
        <Flex flexDirection="row" alignItems="center" gap="12">
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.accent.subtle"
            color="fg.accent.strong"
            rounded="lg"
            style={{ width: '48px', height: '48px', fontSize: '24px' }}
          >
            <FaCog />
          </Flex>
          <Flex flexDirection="column" gap="2">
            <Heading level="2" color="fg.default">
              System Settings
            </Heading>
            <Text fontSize="sm" color="fg.tertiary">
              Manage hospitals, branches, departments, and clinical schedules
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
          {TABS.map(({ value, label, icon }) => (
            <TabsTrigger key={value} value={value}>
              <Flex alignItems="center" gap="8">
                {icon}
                {label}
              </Flex>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ value, Component }) => (
          <TabsContent key={value} value={value}>
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </Box>
  );
};

export default Settings;
