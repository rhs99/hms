import { useState } from 'react';
import axios from 'axios';
import { Button, Field, Flex, Input } from '@optiaxiom/react';
import { FaPlus, FaHospital } from 'react-icons/fa';

import Config from '../../../config';
import { Card, CardBody, CardHeader, StatusMessage } from '../_components';

const HospitalTab = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      await axios.post(`${Config.SERVER_URL}/hospitals`, {
        name: hospitalName,
      });

      setHospitalName('');
      setSuccessMessage('Hospital created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating hospital:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        icon={<FaHospital />}
        title="Add New Hospital"
        subtitle="Register a new hospital in the system"
      />
      <CardBody>
        <form onSubmit={handleSubmit}>
          <Flex flexDirection="column" gap="16">
            <Field label="Hospital Name" required>
              <Input
                placeholder="Enter hospital name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
            </Field>
            <Flex flexDirection="row" gap="16" alignItems="center">
              <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                {isLoading ? 'Creating...' : 'Create Hospital'}
              </Button>
              <StatusMessage tone="success">{successMessage}</StatusMessage>
            </Flex>
          </Flex>
        </form>
      </CardBody>
    </Card>
  );
};

export default HospitalTab;
