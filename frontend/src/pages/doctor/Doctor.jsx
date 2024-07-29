import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import AuthContext from '../../store/auth';
import Table from '../../design-library/table/Table';
import utils from '../../utils';
import Config from '../../config';

import './_doctor.scss';

const Doctor = () => {
  const [slotSchedules, setSlotSchedules] = useState([]);
  const [selectedSlotSchedule, setSelectedSlotSchedule] = useState(null);
  const [date, setDate] = useState(new Date().setHours(23, 59, 59));
  const [parent, setParent] = useState('');
  const [appointments, setAppointments] = useState(null);

  const authCtx = useContext(AuthContext);
  const { branchId, doctorId } = useParams();

  useEffect(() => {
    const url = Config.SERVER_URL + `/slot-schedules?branch_id=${branchId}&employee_id=${doctorId}`;
    axios.get(url).then(({ data }) => {
      setSlotSchedules(data);
    });
  }, [branchId]);

  const getAppointments = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL =
      Config.SERVER_URL + `/appointments/slot-schedules/${selectedSlotSchedule.id}?date=${utils.getFormatedDate(date)}`;
    axios.get(URL).then(({ data }) => {
      setAppointments(data);
    });
  };

  const makeAppointment = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL = Config.SERVER_URL + `/appointments`;
    const data = {
      patient_id: authCtx.getStoredValue().userId,
      slot_schedule_id: selectedSlotSchedule.id,
      date: utils.getFormatedDate(date),
    };

    if (parent.length > 0) {
      data.parent = parseInt(parent);
    }

    axios.post(URL, data).then(({ data }) => {
      console.log(data);
    });
  };

  const renderSlots = () => {
    return (
      <div>
        <Table
          title="Working Schedules"
          headers={['Starting Time', 'Ending Time', 'Day']}
          rows={slotSchedules.map((slotSchedule) => {
            return {
              key: slotSchedule.id,
              value: [slotSchedule.start_at, slotSchedule.end_at, slotSchedule.day],
            };
          })}
          onRowClick={(id) => {
            const ss = slotSchedules.filter((slotSchedule) => slotSchedule.id === id);
            setSelectedSlotSchedule(ss[0]);
          }}
          highlightSelection={true}
        />
      </div>
    );
  };

  const renderAppointments = () => {
    if (!appointments) {
      return null;
    }

    return (
      <Table
        title="Appointments"
        headers={['SL No', 'Patient', 'Appointment Given At']}
        rows={appointments.map((appointment) => {
          return {
            key: appointment.id,
            value: [appointment.serial_no, appointment.full_name, new Date(appointment.created_at).toString()],
          };
        })}
      />
    );
  };

  const getSelectedSlotSchedule = () => {
    if (!Boolean(selectedSlotSchedule)) {
      return 'N/A';
    }
    return `${selectedSlotSchedule.start_at}:${selectedSlotSchedule.end_at} (${selectedSlotSchedule.day})`;
  };

  return (
    <div className="doctor">
      {renderSlots()}
      <div>
        <strong>Selected Slot:</strong> {getSelectedSlotSchedule()}
      </div>
      <div className="doctor-appointment-info">
        <span>
          <strong>Selected date: </strong>
        </span>
        <Datepicker selected={date} dateFormat="yyyy-MM-dd" onChange={(date) => setDate(date)} />
        <label>Parent Appointment Id</label>
        <input value={parent} onChange={(e) => setParent(e.target.value)} />
      </div>
      <div className="action-btn-container">
        <button className="action-btn" onClick={getAppointments}>
          View Appointment
        </button>
        <button
          className="action-btn"
          disabled={!authCtx.isLoggedIn || date < new Date().setHours(0, 0, 0, 0) || !Boolean(selectedSlotSchedule)}
          onClick={makeAppointment}
        >
          Make Appointment
        </button>
      </div>
      {renderAppointments()}
    </div>
  );
};

export default Doctor;
