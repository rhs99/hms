import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '../../design-library/table/Table';
import Prescription from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

const Activities = () => {
  const [appointments, setAppointments] = useState(null);
  const [appointmentToView, setAppointmentToView] = useState(null);

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

  const getAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    const { data } = await axios.get(URL);
    setAppointmentToView(data);
  };

  const renderAllAppointments = () => {
    if (!appointments || appointments.length === 0) {
      return <p>No appointment found!</p>;
    }

    const pastAppointments = [],
      upcomingAppointment = [];

    appointments.forEach((appointment) => {
      if (appointment.is_resolved) {
        pastAppointments.push(appointment);
      } else {
        upcomingAppointment.push(appointment);
      }
    });

    return (
      <>
        <Table
          title="Upcoming Appointments"
          headers={['SL No', 'Id', 'Date', 'Parent', 'Hospital', 'Branch', 'Department', 'Doctor', 'Time']}
          rows={upcomingAppointment.map((appointment) => {
            return {
              key: appointment.id,
              value: [
                appointment.serial_no,
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
        <Table
          title="Past Appointments"
          headers={['SL No', 'Id', 'Date', 'Parent', 'Hospital', 'Branch', 'Department', 'Doctor', 'Time']}
          rows={pastAppointments.map((appointment) => {
            return {
              key: appointment.id,
              value: [
                appointment.serial_no,
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
          onRowClick={async (id) => {
            await getAppointment(id);
          }}
          highlightSelection={true}
        />
      </>
    );
  };

  if (!authCtx.isLoggedIn) {
    return navigate('/sign-in');
  }

  return (
    <div>
      <h1>My Activities</h1>
      {appointmentToView && (
        <Prescription data={appointmentToView} onCancel={() => setAppointmentToView(null)} viewOnly={true} />
      )}
      {renderAllAppointments()}
    </div>
  );
};

export default Activities;
