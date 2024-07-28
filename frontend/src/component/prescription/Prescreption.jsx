import axios from 'axios';
import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import PdfDocument from '../PdfDocument';
import Config from '../../config';

import './_index.scss';

const Prescreption = ({ appointment, onUpdate, onCancel, viewOnly }) => {
  const [prescreption, setPrescreption] = useState(appointment.details || '');

  const updateAppointment = async () => {
    const URL = Config.SERVER_URL + `/appointments/${appointment.id}`;
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

  const disabled = prescreption.length === 0;

  const renderViewOnlyPrescription = () => {
    const hospitalData = {
      Hospital: appointment.hospital,
      Branch: appointment.branch,
      Phone: appointment.phone,
      Email: appointment.email,
    };

    const doctorData = {
      Department: appointment.dept,
      Doctor: appointment.doctor,
      Degree: appointment.degree,
    };

    const patientData = {
      Name: appointment.name,
      Gender: appointment.gender,
      Age: calculateAge(appointment.dob),
      'Blood Group': getFormattedBloodGroup(appointment.blood_group),
      Date: appointment.date,
    };

    const bodyData = {
      Prescription: appointment.details,
    };
    return (
      <PDFViewer>
        <PdfDocument
          hospitalData={hospitalData}
          doctorData={doctorData}
          patientData={patientData}
          bodyData={bodyData}
        />
      </PDFViewer>
    );
  };

  const renderPrescription = () => {
    return (
      <div className="prescription">
        <div className="prescription-meta-info-container">
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Patient</span>
            <span className="prescription-meta-value">{appointment.name}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Gender</span>
            <span className="prescription-meta-value">{appointment.gender}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Age</span>
            <span className="prescription-meta-value">{calculateAge(appointment.dob)}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Blood Group</span>
            <span className="prescription-meta-value">{getFormattedBloodGroup(appointment.blood_group)}</span>
          </div>
        </div>
        <div>
          <textarea
            className="prescription-box"
            placeholder="Prescribe here"
            value={prescreption}
            onChange={(e) => setPrescreption(e.target.value)}
          />
        </div>
        <div className="prescription-done">
          <button className="prescription-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="prescription-done-btn" disabled={disabled} onClick={updateAppointment}>
            Done
          </button>
        </div>
      </div>
    );
  };

  return <>{Boolean(viewOnly) ? renderViewOnlyPrescription() : renderPrescription()}</>;
};

export default Prescreption;
