import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Field, Input, Heading, Text, Flex } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';

const BranchTab = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/hospitals`);
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHospital) {
      alert('Please select a hospital');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await axios.post(`${Config.SERVER_URL}/branches`, {
        hospital_id: selectedHospital.id,
        address,
        phone,
        email,
      });

      setSelectedHospital(null);
      setAddress('');
      setPhone('');
      setEmail('');
      setSuccessMessage('Branch created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="settings-tab">
      <Box className="settings-tab-form">
        <Heading level="3">Add New Branch</Heading>
        <form onSubmit={handleSubmit}>
          <Field label="Hospital" required>
            <Menu
              options={hospitals.map((hospital) => ({
                label: hospital.name,
                execute: () => setSelectedHospital(hospital),
              }))}
            >
              <MenuTrigger>{selectedHospital ? selectedHospital.name : 'Select hospital'}</MenuTrigger>
              <MenuContent />
            </Menu>
          </Field>
          <Field label="Address" required>
            <Input
              placeholder="Enter branch address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Field>
          <Field label="Phone" required>
            <Input
              placeholder="Enter phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Field>
          <Field label="Email" required>
            <Input
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
            <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
              {isLoading ? 'Creating...' : 'Create Branch'}
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
    </Box>
  );
};

export default BranchTab;
