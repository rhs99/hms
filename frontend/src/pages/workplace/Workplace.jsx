import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import utils from '../../utils';
import Table from '../../design-library/table/Table';
import AuthContext from '../../store/auth';
import Config from '../../config';

import './_index.scss';

const Workplace = () => {
  const [workplaces, setWorkplaces] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [appointmentToResolve, setAppointmentToResolve] = useState(null);
  const [prescreption, setPrescreption] = useState('');

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      return;
    }

    const URL = Config.SERVER_URL + `/work-places/employees/${authCtx.getStoredValue().userId}`;
    axios.get(URL).then(({ data }) => {
      setWorkplaces(data);
    });
  }, []);

  const getAllAppointments = (slot_schedule_id) => {
    const URL =
      Config.SERVER_URL + `/appointments/slot-schedules/${slot_schedule_id}?date=${utils.getFormatedDate(new Date())}`;
    axios.get(URL).then(({ data }) => {
      setAppointments(data);
    });
  };

  const resolveAppointment = (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    axios.get(URL).then(({ data }) => {
      setAppointmentToResolve(data);
    });
  };

  const updateAppointment = () => {
    if (!appointmentToResolve) {
      return;
    }

    const URL = Config.SERVER_URL + `/appointments/${appointmentToResolve.id}`;
    axios.patch(URL, { details: prescreption }).then(({ data }) => {
      setAppointmentToResolve(null);
    });
  };

  if (!authCtx.isLoggedIn) {
    return navigate('/');
  }

  const renderAllWorkplaces = () => {
    if (!workplaces || workplaces.length === 0) {
      return <p>No workplace found!</p>;
    }
    return (
      <Table
        title="My Workplaces"
        headers={['Hospital', 'Branch', 'Day', 'Starting At', 'Ending At']}
        rows={workplaces.map((workplace) => {
          return {
            key: workplace.slot_schedule_id,
            value: [workplace.hospital, workplace.branch, workplace.day, workplace.start_at, workplace.end_at],
          };
        })}
        onRowClick={getAllAppointments}
        highlightSelection={true}
      />
    );
  };

  const renderAllAppointments = () => {
    if (!appointments || appointments.length === 0) {
      return <p>No appointment found!</p>;
    }
    return (
      <Table
        title="My Appointments"
        headers={['SL No', 'Parent', 'Patient', 'Gender']}
        rows={appointments.map((appointment, idx) => {
          return {
            key: appointment.id,
            value: [idx+1, appointment.parent || 'N/A', appointment.full_name, appointment.gender],
          };
        })}
        onRowClick={resolveAppointment}
        highlightSelection={true}
      />
    );
  };

  const renderAppointmentResolver = () => {
    return (
      <div className="workplace-resolver">
        <div className="workplace-meta-info">
          <p>Patient: {appointmentToResolve.name}</p>
          <p>Gender: {appointmentToResolve.gender}</p>
          <p>Date of Birth: {appointmentToResolve.dob}</p>
          <p>Blood Group: {appointmentToResolve.blood_group}</p>
        </div>
        <div>
          <textarea
            className="workplace-prescreption"
            placeholder="Prescribe here"
            value={prescreption}
            onChange={(e) => setPrescreption(e.target.value)}
          />
        </div>
        <button className="workplace-done" onClick={updateAppointment}>
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="workplace">
      {renderAllWorkplaces()}
      {appointmentToResolve && renderAppointmentResolver()}
      {appointments && renderAllAppointments()}
    </div>
  );
};

export default Workplace;
