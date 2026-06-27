import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Field, Flex, Input } from '@optiaxiom/react';
import { FaPlus, FaHospital } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader, useAlertState } from '../_components';

const HospitalTab = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { alert, show, dismiss } = useAlertState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dismiss();

    try {
      await axios.post(`${Config.SERVER_URL}/hospitals`, {
        name: hospitalName,
      });

      setHospitalName('');
      show('success', 'Hospital created successfully!');
    } catch {
      show('danger', 'Failed to create hospital. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader icon={<FaHospital />} title="Add New Hospital" subtitle="Register a new hospital in the system" />
      <CardBody>
        <Flex flexDirection="column" gap="16">
          <AlertBanner alert={alert} onDismiss={dismiss} />
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
              <Box>
                <Button type="submit" appearance="primary" disabled={isLoading} icon={<FaPlus />}>
                  {isLoading ? 'Creating...' : 'Create Hospital'}
                </Button>
              </Box>
            </Flex>
          </form>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default HospitalTab;
