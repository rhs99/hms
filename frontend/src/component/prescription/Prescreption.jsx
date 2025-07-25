import axios from 'axios';
import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Button, Flex, Text, Textarea } from '@optiaxiom/react';

import PdfDocument from './PdfDocument';
import Config from '../../config';

const Prescreption = ({ data, onUpdate, onCancel, viewOnly }) => {
  const { user_data, appointments } = data;
  const [prescreption, setPrescreption] = useState(appointments.slice(-1)[0].details || '');

  const updateAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    await axios.patch(URL, { details: prescreption });
    await onUpdate();
  };

  const getFormattedBloodGroup = (bg) => {
    switch (bg) {
      case 'A_POS':
        return 'A+';
      case 'A_NEG':
        return 'A-';
      case 'B_POS':
        return 'B+';
      case 'B_Neg':
        return 'B-';
      case 'O_POS':
        return 'O+';
      case 'O_NEG':
        return 'O-';
      case 'AB_POS':
        return 'AB+';
      case 'AB_NEG':
        return 'AB-';
      default:
        return 'N/A';
    }
  };

  function calculateAge(birthday) {
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const renderViewOnlyPrescription = () => {
    if (appointments.length <= 0) {
      return null;
    }

    if (!viewOnly && appointments.length <= 1) {
      return null;
    }

    const pages = [];
    const patientData = {
      Name: user_data.name,
      Gender: user_data.gender,
      Age: calculateAge(user_data.dob),
      'Blood Group': getFormattedBloodGroup(user_data.blood_group),
    };

    appointments.forEach((appointment) => {
      pages.push({
        hospitalData: {
          Hospital: appointment.hospital,
          Branch: appointment.branch,
          Phone: appointment.phone,
          Email: appointment.email,
        },
        doctorData: {
          Department: appointment.dept,
          Doctor: appointment.doctor,
          Degree: appointment.degree,
        },
        patientData: {
          ...patientData,
          Date: appointment.date,
        },
        bodyData: {
          Prescription: appointment.details,
        },
      });
    });

    if (!viewOnly) {
      pages.shift();
    }

    return (
      <Flex flexDirection="column" gap="12">
        <PDFViewer>
          <PdfDocument pages={pages} />
        </PDFViewer>
        {viewOnly && (
          <Button
            appearance="danger"
            onClick={onCancel}
            style={{ width: 'auto', alignSelf: 'flex-start', minWidth: 0 }}
          >
            Close
          </Button>
        )}
      </Flex>
    );
  };

  const renderEditablePrescription = (appointment) => {
    const disabled = prescreption.length === 0;

    return (
      <Flex flexDirection="column" gap="12" style={{ border: '1px solid #ccc', padding: '16px' }}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="column" gap="12">
            <Text>Patient</Text>
            <Text color="fg.tertiary">{user_data.name}</Text>
          </Flex>
          <Flex flexDirection="column" gap="12">
            <Text>Gender</Text>
            <Text color="fg.tertiary">{user_data.gender}</Text>
          </Flex>
          <Flex flexDirection="column" gap="12">
            <Text>Age</Text>
            <Text color="fg.tertiary">{calculateAge(user_data.dob)}</Text>
          </Flex>
          <Flex flexDirection="column" gap="12">
            <Text>Blood Group</Text>
            <Text color="fg.tertiary">{getFormattedBloodGroup(user_data.blood_group)}</Text>
          </Flex>
        </Flex>
        <Textarea
          style={{ height: '150px', width: '100%' }}
          placeholder="Prescribe here"
          value={prescreption}
          onChange={(e) => setPrescreption(e.target.value)}
        />
        <Flex flexDirection="row" gap="12" justifyContent="flex-end">
          <Button appearance="danger-outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button appearance="primary" disabled={disabled} onClick={() => updateAppointment(appointment.id)}>
            Done
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <div className="prescription">
      {!viewOnly && renderEditablePrescription(appointments.slice(-1)[0])}
      {renderViewOnlyPrescription()}
    </div>
  );
};

export default Prescreption;
