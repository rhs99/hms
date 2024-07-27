import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Table from '../../design-library/table/Table';
import Config from '../../config';

import './_doctor.scss';

const Doctor = () => {
  const [slotSchedules, setSlotSchedules] = useState([]);
  const [selectedSlotSchedule, setSelectedSlotSchedule] = useState(null);
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState(null);

  const { branchId, doctorId } = useParams();

  useEffect(() => {
    const url = Config.SERVER_URL + `/slot-schedules?branch_id=${branchId}&employee_id=${doctorId}`;
    axios.get(url).then(({ data }) => {
      setSlotSchedules(data);
    });
  }, [branchId]);

  const getFormatedDate = () => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${year}-${month}-${day}`;
  };

  const getAppointments = () => {
    if (!selectedSlotSchedule || !date) {
      return;
    }

    const URL =
      Config.SERVER_URL + `/appointments?slot_schedule_id=${selectedSlotSchedule.id}&date=${getFormatedDate()}`;
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
      patient_id: 1,
      slot_schedule_id: selectedSlotSchedule.id,
      date: getFormatedDate(),
    };

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
        headers={['Patient', 'Appointment Given At']}
        rows={appointments.map((appointment, idx) => {
          return {
            key: idx,
            value: [appointment.name, new Date(appointment.created_at).toString()],
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
      <div>
        <span>
          <strong>Selected date: </strong>
        </span>
        <Datepicker selected={date} dateFormat="yyyy-MM-dd" onChange={(date) => setDate(date)} />
      </div>
      <div className="action-btn-container">
        <button className="action-btn" onClick={getAppointments}>
          View Appointment
        </button>
        <button className="action-btn" onClick={makeAppointment}>
          Make Appointment
        </button>
      </div>
      {renderAppointments()}
    </div>
  );
};

export default Doctor;
