import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Field, Input, Heading, Text, Flex } from '@optiaxiom/react';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';

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
    <Box className="settings-tab">
      <Box className="settings-tab-form">
        <Heading level="3">Add New Hospital</Heading>
        <form onSubmit={handleSubmit}>
          <Field label="Hospital Name" required>
            <Input
              placeholder="Enter hospital name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </Field>
          <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
            <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
              {isLoading ? 'Creating...' : 'Create Hospital'}
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

export default HospitalTab;
