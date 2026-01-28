import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Field, Input, Heading, Text, Flex, Badge } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
import { FaPlus, FaCheckCircle, FaSearch, FaUser } from 'react-icons/fa';

import Config from '../../../config';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSearchUser = async () => {
    if (!username.trim()) {
      setErrorMessage('Please enter a username');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsSearching(true);
    setErrorMessage('');
    setSelectedUser(null);

    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/users?username=${username}`);

      if (data) {
        setSelectedUser({ ...data, user_name: username });
        setErrorMessage('');
      } else {
        setErrorMessage('User not found. Please check the username.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setErrorMessage('User not found. Please check the username.');
      setTimeout(() => setErrorMessage(''), 5000);
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
      setErrorMessage('Please search and select a user first');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!selectedDepartment) {
      setErrorMessage('Please select a department');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Create doctor record using the user ID from selectedUser
      await axios.post(`${Config.SERVER_URL}/doctors`, {
        user_id: selectedUser.id,
        dept_id: selectedDepartment.id,
        registration_no: parseInt(registrationNo),
        degree,
        experience,
      });

      resetForm();
      setSuccessMessage('Doctor created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating doctor:', error);
      setErrorMessage('Error creating doctor. Please check all fields and try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="settings-tab">
      <Box className="settings-tab-form">
        <Heading level="3">Add New Doctor</Heading>
        <Text color="fg.tertiary" style={{ marginBottom: '16px' }}>
          Create a doctor profile for an existing user account.
        </Text>

        {/* User Search Section */}
        <Box
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Heading level="4" style={{ marginBottom: '12px' }}>
            Search User
          </Heading>
          <Flex gap="12" alignItems="end">
            <Field label="Username" required style={{ flex: 1 }}>
              <Input
                placeholder="Enter username"
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
            <Box
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <Flex alignItems="center" gap="12" style={{ marginBottom: '8px' }}>
                <FaUser style={{ color: 'var(--color-primary)' }} />
                <Text fontWeight="600">User Found</Text>
              </Flex>
              <Flex gap="8" style={{ flexWrap: 'wrap' }}>
                <Badge intent="success">Name: {selectedUser.full_name}</Badge>
                <Badge>Email: {selectedUser.email}</Badge>
                <Badge>Phone: {selectedUser.phone}</Badge>
                <Badge>Gender: {selectedUser.gender}</Badge>
              </Flex>
            </Box>
          )}
        </Box>

        {/* Doctor Information Form */}
        {selectedUser && (
          <form onSubmit={handleSubmit}>
            <Heading level="4" style={{ marginBottom: '12px' }}>
              Doctor Information
            </Heading>

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

            <Field label="Degree" required>
              <Input
                placeholder="e.g., MBBS, MD, FCPS"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </Field>

            <Field label="Experience" required>
              <Input
                placeholder="e.g., Senior Consultant, 10 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </Field>

            <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
              <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                {isLoading ? 'Creating...' : 'Create Doctor Profile'}
              </Button>
              {successMessage && (
                <Flex alignItems="center" gap="8" style={{ color: 'var(--color-success)' }}>
                  <FaCheckCircle />
                  <Text>{successMessage}</Text>
                </Flex>
              )}
            </Flex>
          </form>
        )}

        {errorMessage && <Text style={{ color: 'var(--color-danger)', marginTop: '12px' }}>{errorMessage}</Text>}
      </Box>
    </Box>
  );
};

export default DoctorTab;
