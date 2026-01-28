import { useState } from 'react';
import { Box, Heading, Flex } from '@optiaxiom/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@optiaxiom/react';
import { FaCog, FaHospital, FaBuilding, FaStethoscope, FaClock, FaUserMd, FaCalendarAlt } from 'react-icons/fa';

import HospitalTab from './tabs/HospitalTab';
import BranchTab from './tabs/BranchTab';
import DepartmentTab from './tabs/DepartmentTab';
import SlotTab from './tabs/SlotTab';
import DoctorTab from './tabs/DoctorTab';
import ScheduleTab from './tabs/ScheduleTab';

import './_index.scss';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('hospitals');

  return (
    <Box className="settings">
      <Box className="settings-header">
        <Flex flexDirection="row" alignItems="center" gap="12">
          <FaCog size={32} style={{ color: 'var(--color-primary)' }} />
          <Heading level="2" className="settings-title">
            System Settings
          </Heading>
        </Flex>
      </Box>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="settings-tabs">
        <TabsList className="settings-tabs-list">
          <TabsTrigger value="hospitals">
            <FaHospital style={{ marginRight: '8px' }} />
            Hospitals
          </TabsTrigger>
          <TabsTrigger value="branches">
            <FaBuilding style={{ marginRight: '8px' }} />
            Branches
          </TabsTrigger>
          <TabsTrigger value="departments">
            <FaStethoscope style={{ marginRight: '8px' }} />
            Departments
          </TabsTrigger>
          <TabsTrigger value="slots">
            <FaClock style={{ marginRight: '8px' }} />
            Time Slots
          </TabsTrigger>
          <TabsTrigger value="doctors">
            <FaUserMd style={{ marginRight: '8px' }} />
            Doctors
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <FaCalendarAlt style={{ marginRight: '8px' }} />
            Doctor Schedules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals">
          <HospitalTab />
        </TabsContent>

        <TabsContent value="branches">
          <BranchTab />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentTab />
        </TabsContent>

        <TabsContent value="slots">
          <SlotTab />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorTab />
        </TabsContent>

        <TabsContent value="schedules">
          <ScheduleTab />
        </TabsContent>
      </Tabs>
    </Box>
  );
};

export default Settings;
