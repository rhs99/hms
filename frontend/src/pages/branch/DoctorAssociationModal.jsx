import { useState } from 'react';
import axios from 'axios';
import { Flex, Button, Text, SearchInput, Badge } from '@optiaxiom/react';

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';

import Utils from '../../utils';
import Config from '../../config';

const DoctorAssociationModal = ({ open, onClose, branchId, deptId }) => {
  const [reginstrationNo, setRegistrationNo] = useState('');
  const [doctor, setDoctor] = useState(null);

  const getDoctor = () => {
    const url = Config.SERVER_URL + `/doctors?registration_no=${reginstrationNo}`;
    axios.get(url).then((response) => {
      setDoctor(response.data);
    });
  };

  const handleAssociateDoctor = () => {
    if (!doctor) return;
    const url = Config.SERVER_URL + `/work-places`;
    const data = {
      branch_id: branchId,
      employee_id: doctor.user_id,
      start_date: Utils.getFormatedDate(new Date()),
    };
    axios.post(url, data).then(() => {
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="sm">
        <DialogHeader>Associate Doctor</DialogHeader>
        <DialogBody>
          <Flex direction="column" gap="8">
            <Flex flexDirection="row" gap="8">
              <SearchInput
                value={reginstrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="Enter Registration No"
              />
              <Button onClick={getDoctor}>Search</Button>
            </Flex>
            {doctor && (
              <Flex flexDirection="column" gap="8">
                <Badge w="fit" intent="success">
                  Found
                </Badge>
                <Text>{doctor.full_name}</Text>
                <Text>{doctor.degree}</Text>
                <Text>{doctor.experience}</Text>
              </Flex>
            )}
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button appearance="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={handleAssociateDoctor} disabled={!doctor}>
            Associate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorAssociationModal;
