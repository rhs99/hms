import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '../../design-library/table/Table';
import AuthContext from '../../store/auth';
import Config from '../../config';

const Activities = () => {
  const [appointments, setAppointments] = useState(null);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      return;
    }

    const URL = Config.SERVER_URL + `/appointments/users/${authCtx.getStoredValue().userId}`;
    axios.get(URL).then(({ data }) => {
      setAppointments(data);
    });
  }, []);

  const renderAllAppointments = () => {
    if (!appointments || appointments.length === 0) {
      return <p>No appointment found!</p>;
    }
    return (
      <Table
        title="My Appointments"
        headers={['Id', 'Date', 'Parent', 'Hospital', 'Branch', 'Department', 'Doctor', 'Time']}
        rows={appointments.map((appointment) => {
          return {
            key: appointment.id,
            value: [
              appointment.id,
              appointment.date,
              appointment.parent || 'N/A',
              appointment.hospital,
              appointment.branch,
              appointment.department,
              appointment.doctor,
              appointment.time,
            ],
          };
        })}
      />
    );
  };

  if (!authCtx.isLoggedIn) {
    return navigate('/sign-in');
  }

  return (
    <div>
      <h1>My Activities</h1>
      {renderAllAppointments()}
    </div>
  );
};

export default Activities;
