import axios from 'axios';
import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import PdfDocument from '../PdfDocument';
import Config from '../../config';

import './_index.scss';

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
      <>
        <PDFViewer>
          <PdfDocument pages={pages} />
        </PDFViewer>
        {viewOnly && (
          <button onClick={onCancel} className="prescription-close-btn">
            Close
          </button>
        )}
      </>
    );
  };

  const renderEditablePrescription = (appointment) => {
    const disabled = prescreption.length === 0;

    return (
      <div className="prescription-input">
        <div className="prescription-meta-info-container">
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Patient</span>
            <span className="prescription-meta-value">{user_data.name}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Gender</span>
            <span className="prescription-meta-value">{user_data.gender}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Age</span>
            <span className="prescription-meta-value">{calculateAge(user_data.dob)}</span>
          </div>
          <div className="prescription-meta-info">
            <span className="prescription-meta-key">Blood Group</span>
            <span className="prescription-meta-value">{getFormattedBloodGroup(user_data.blood_group)}</span>
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
          <button
            className="prescription-done-btn"
            disabled={disabled}
            onClick={() => updateAppointment(appointment.id)}
          >
            Done
          </button>
        </div>
      </div>
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
