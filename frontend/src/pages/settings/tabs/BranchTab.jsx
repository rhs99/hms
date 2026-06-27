import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Field, Flex, Input, Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
import { FaPlus, FaBuilding } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader, useAlertState } from '../_components';

const BranchTab = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { alert, show, dismiss } = useAlertState();

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/hospitals`);
      setHospitals(data);
    } catch (error) {
      show('danger', 'Failed to load hospitals.');
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHospital) {
      show('warning', 'Please select a hospital.');
      return;
    }

    setIsLoading(true);
    dismiss();

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
      show('success', 'Branch created successfully!');
    } catch (error) {
      show('danger', 'Failed to create branch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        icon={<FaBuilding />}
        title="Add New Branch"
        subtitle="Register a hospital branch with contact details"
      />
      <CardBody>
        <Flex flexDirection="column" gap="16">
          <AlertBanner alert={alert} onDismiss={dismiss} />
          <form onSubmit={handleSubmit}>
            <Flex flexDirection="column" gap="16">
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
            <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
              <Field label="Phone" required style={{ flex: '1 1 200px' }}>
                <Input
                  placeholder="Enter phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>
              <Field label="Email" required style={{ flex: '1 1 200px' }}>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
            </Flex>
              <Box>
                <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                  {isLoading ? 'Creating...' : 'Create Branch'}
                </Button>
              </Box>
            </Flex>
          </form>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default BranchTab;
