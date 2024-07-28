import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import utils from '../../utils';
import Table from '../../design-library/table/Table';
import Prescreption from '../../component/prescription/Prescreption';
import AuthContext from '../../store/auth';
import Config from '../../config';

import './_index.scss';

const Workplace = () => {
  const [workplaces, setWorkplaces] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState(null);
  const [resolvedAppointments, setResolvedAppointments] = useState(null);
  const [appointmentToResolve, setAppointmentToResolve] = useState(null);
  const [selectedSlotScheduleId, setSelectedSlotScheduleId] = useState(null);

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

  useEffect(() => {
    if (selectedSlotScheduleId) {
      getAllAppointments().then(() => {});
    }
  }, [selectedSlotScheduleId]);

  const getAllAppointments = async () => {
    if (!selectedSlotScheduleId) {
      return;
    }

    const PENDING_URL =
      Config.SERVER_URL +
      `/appointments/slot-schedules/${selectedSlotScheduleId}?date=${utils.getFormatedDate(new Date())}&pending=True`;

    const RESOLVED_URL =
      Config.SERVER_URL +
      `/appointments/slot-schedules/${selectedSlotScheduleId}?date=${utils.getFormatedDate(new Date())}&pending=False`;

    const promises = [axios.get(PENDING_URL), axios.get(RESOLVED_URL)];
    const appointments = await Promise.all(promises);

    setPendingAppointments(appointments[0].data);
    setResolvedAppointments(appointments[1].data);
  };

  const resolveAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    const { data } = await axios.get(URL);
    setAppointmentToResolve(data);
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
        onRowClick={(id) => setSelectedSlotScheduleId(id)}
        highlightSelection={true}
      />
    );
  };

  const renderAppointments = (appointmentDatas, isPending) => {
    if (!appointmentDatas || appointmentDatas.length === 0) {
      return <p>No appointment found!</p>;
    }
    return (
      <Table
        title={`${isPending ? 'Pending' : 'Resolved'} Appointments`}
        headers={['SL No', 'Parent', 'Patient', 'Gender']}
        rows={appointmentDatas.map((appointment, idx) => {
          return {
            key: appointment.id,
            value: [idx + 1, appointment.parent || 'N/A', appointment.full_name, appointment.gender],
          };
        })}
        onRowClick={resolveAppointment}
        highlightSelection={true}
      />
    );
  };

  return (
    <div className="workplace">
      {renderAllWorkplaces()}
      {appointmentToResolve && (
        <Prescreption
          appointment={appointmentToResolve}
          onUpdate={async () => {
            setAppointmentToResolve(null);
            await getAllAppointments();
          }}
          onCancel={()=>setAppointmentToResolve(null)}
        />
      )}
      {pendingAppointments && renderAppointments(pendingAppointments, true)}
      {resolvedAppointments && renderAppointments(resolvedAppointments, false)}
    </div>
  );
};

export default Workplace;
