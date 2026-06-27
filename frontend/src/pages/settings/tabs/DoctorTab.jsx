import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Input,
  Menu,
  MenuContent,
  MenuTrigger,
  SearchInput,
  Text,
} from '@optiaxiom/react';
import { FaPlus, FaSearch, FaUser, FaUserMd } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader, SectionLabel, useAlertState } from '../_components';

const DoctorTab = () => {
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [registrationNo, setRegistrationNo] = useState('');
  const [degree, setDegree] = useState('');
  const [experience, setExperience] = useState('');

  const [departments, setDepartments] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { alert, show, dismiss } = useAlertState();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get(`${Config.SERVER_URL}/departments`);
        setDepartments(data);
      } catch {
        show('danger', 'Failed to load departments.');
      }
    };
    fetchDepartments();
  }, [show]);

  const handleSearchUser = async () => {
    if (!username.trim()) {
      show('warning', 'Please enter a username.');
      return;
    }

    setIsSearching(true);
    dismiss();
    setSelectedUser(null);

    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/users?username=${username}`);

      if (data) {
        setSelectedUser({ ...data, user_name: username });
      } else {
        show('danger', 'User not found. Please check the username.');
      }
    } catch {
      show('danger', 'User not found. Please check the username.');
    } finally {
      setIsSearching(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setSelectedUser(null);
    setSelectedDepartment(null);
    setRegistrationNo('');
    setDegree('');
    setExperience('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      show('warning', 'Please search and select a user first.');
      return;
    }

    if (!selectedDepartment) {
      show('warning', 'Please select a department.');
      return;
    }

    setIsLoading(true);
    dismiss();

    try {
      await axios.post(`${Config.SERVER_URL}/doctors`, {
        user_id: selectedUser.id,
        dept_id: selectedDepartment.id,
        registration_no: parseInt(registrationNo),
        degree,
        experience,
      });

      resetForm();
      show('success', 'Doctor created successfully!');
    } catch {
      show('danger', 'Failed to create doctor. Please check all fields and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        icon={<FaUserMd />}
        title="Add New Doctor"
        subtitle="Create a doctor profile for an existing user account"
      />
      <CardBody>
        <Flex flexDirection="column" gap="24">
          <AlertBanner alert={alert} onDismiss={dismiss} />
          <Flex
            flexDirection="column"
            gap="16"
            p="16"
            bg="bg.secondary"
            rounded="lg"
            border="1"
            borderColor="border.tertiary"
          >
            <SectionLabel>Step 1 · Find User</SectionLabel>
            <Flex flexDirection="row" gap="12" alignItems="end">
              <Field label="Username" required style={{ flex: 1 }}>
                <SearchInput
                  placeholder="Search by username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                />
              </Field>
              <Button onClick={handleSearchUser} disabled={isSearching} icon={<FaSearch />}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </Flex>

            {selectedUser && (
              <Box bg="bg.default" rounded="md" border="1" borderColor="border.tertiary" p="12">
                <Flex alignItems="center" gap="12" style={{ marginBottom: '8px' }}>
                  <Box color="fg.accent.strong">
                    <FaUser />
                  </Box>
                  <Text fontSize="sm" fontWeight="600" color="fg.default">
                    User Found
                  </Text>
                </Flex>
                <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap' }}>
                  <Badge intent="success">Name: {selectedUser.full_name}</Badge>
                  <Badge intent="information">Email: {selectedUser.email}</Badge>
                  <Badge intent="information">Phone: {selectedUser.phone}</Badge>
                  <Badge intent="information">Gender: {selectedUser.gender}</Badge>
                </Flex>
              </Box>
            )}
          </Flex>

          {selectedUser && (
            <form onSubmit={handleSubmit}>
              <Flex
                flexDirection="column"
                gap="16"
                p="16"
                bg="bg.secondary"
                rounded="lg"
                border="1"
                borderColor="border.tertiary"
              >
                <SectionLabel>Step 2 · Doctor Information</SectionLabel>

                <Field label="Department" required>
                  <Menu
                    options={departments.map((dept) => ({
                      label: dept.name,
                      execute: () => setSelectedDepartment(dept),
                    }))}
                  >
                    <MenuTrigger>{selectedDepartment ? selectedDepartment.name : 'Select department'}</MenuTrigger>
                    <MenuContent />
                  </Menu>
                </Field>

                <Field label="Registration Number" required>
                  <Input
                    placeholder="Enter registration number"
                    type="number"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    required
                  />
                </Field>

                <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                  <Field label="Degree" required style={{ flex: '1 1 200px' }}>
                    <Input
                      placeholder="e.g., MBBS, MD, FCPS"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Experience" required style={{ flex: '1 1 200px' }}>
                    <Input
                      placeholder="e.g., Senior Consultant, 10 years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                  </Field>
                </Flex>

                <Box>
                  <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                    {isLoading ? 'Creating...' : 'Create Doctor Profile'}
                  </Button>
                </Box>
              </Flex>
            </form>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default DoctorTab;
