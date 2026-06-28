import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';

import Utils from '../../utils';
import Config from '../../config';
import DoctorSearch from '../../component/DoctorSearch';

const DoctorAssociationModal = ({ open, onClose, branchId, deptId }) => {
  const [doctor, setDoctor] = useState(null);

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
          <DoctorSearch
            onDoctorSelect={setDoctor}
            validate={(doctor) => (doctor.dept_id !== deptId ? 'Doctor does not belong to this department.' : null)}
          />
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
