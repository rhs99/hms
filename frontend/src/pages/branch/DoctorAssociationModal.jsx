import { useState } from 'react';
import axios from 'axios';
import { Flex, Button, Text, Input } from '@optiaxiom/react';

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogForm } from '@optiaxiom/react';

import Utils from '../../utils';
import Config from '../../config';

const DoctorAssociationModal = ({ open, onClose, branchId }) => {
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
    const url = Config.SERVER_URL + `/workplaces`;
    const data = {
      branch_id: branchId,
      employee_id: doctor.user_id,
      state_date: Utils.getFormatedDate(new Date()),
    };
    axios.post(url, data).then(() => {
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Associate Doctor</DialogHeader>
        <DialogForm>
          <DialogBody>
            <Flex>
              <Text>Registration No:</Text>
              <Input
                value={reginstrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="Enter Registration No"
                required
              />
            </Flex>
          </DialogBody>
          <DialogFooter>
            <Flex flexDirection="row" gap="8">
              <Button appearance="danger" onClick={onClose}>
                Cancel
              </Button>
              {!doctor && <Button disabled={!reginstrationNo} appearance="primary" onClick={getDoctor}>
                Get
              </Button>}
              {doctor && <Button appearance="primary" onClick={handleAssociateDoctor}>
                Associate
              </Button>}
            </Flex>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorAssociationModal;
