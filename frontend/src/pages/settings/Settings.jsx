import { useState } from 'react';
import { Box, Heading, Flex, Text, Tabs, TabsList, TabsTrigger, TabsContent } from '@optiaxiom/react';
import { FaCog, FaHospital, FaBuilding, FaStethoscope, FaClock, FaUserMd, FaCalendarAlt } from 'react-icons/fa';

import HospitalTab from './tabs/HospitalTab';
import BranchTab from './tabs/BranchTab';
import DepartmentTab from './tabs/DepartmentTab';
import SlotTab from './tabs/SlotTab';
import DoctorTab from './tabs/DoctorTab';
import ScheduleTab from './tabs/ScheduleTab';

const TABS = [
  { value: 'hospitals', label: 'Hospitals', icon: <FaHospital />, Component: HospitalTab },
  { value: 'branches', label: 'Branches', icon: <FaBuilding />, Component: BranchTab },
  { value: 'departments', label: 'Departments', icon: <FaStethoscope />, Component: DepartmentTab },
  { value: 'slots', label: 'Time Slots', icon: <FaClock />, Component: SlotTab },
  { value: 'doctors', label: 'Doctors', icon: <FaUserMd />, Component: DoctorTab },
  { value: 'schedules', label: 'Doctor Schedules', icon: <FaCalendarAlt />, Component: ScheduleTab },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('hospitals');

  return (
    <Box bg="bg.page" p="24" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        p="20"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '24px' }}
      >
        <Flex flexDirection="row" alignItems="center" gap="16">
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.accent.subtle"
            color="fg.accent"
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
