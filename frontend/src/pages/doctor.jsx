import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Config from '../config';

const Doctor = () => {
  const [slotSchedules, setSlotSchedules] = useState([]);
  const [selectedSlotSchedule, setSelectedSlotSchedule] = useState(null);
  const [date, setDate] = useState(null);
  const [appointments, setAppointments] = useState(null);

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

    axios
      .get(Config.SERVER_URL + `/appointments?slot_schedule_id=${selectedSlotSchedule.id}&date=${date}`)
      .then(({ data }) => {
        setAppointments(data);
      });
  };

  const renderSlots = () => {
    return (
      <div>
        <h2>Slots</h2>
        <table>
          <thead>
            <tr>
              <th>Start At</th>
              <th>End At</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {slotSchedules.map((slotSchedule) => {
              return (
                <tr key={slotSchedule.id} onClick={() => setSelectedSlotSchedule(slotSchedule)}>
                  <td>{slotSchedule.start_at}</td>
                  <td>{slotSchedule.end_at}</td>
                  <td>{slotSchedule.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAppointments = () => {
    if (!appointments) {
      return null;
    }

    return (
      <div>
        <h2>Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, idx) => {
              return (
                <tr key={idx}>
                  <td>{appointment.name}</td>
                  <td>{appointment.created_at}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {renderSlots()}

      <p>
        <strong>Selected Slot:</strong> {selectedSlotSchedule?.start_at || 'NA'}:{selectedSlotSchedule?.end_at || 'NA'}{' '}
        ({selectedSlotSchedule?.day || 'NA'})
      </p>
      <label htmlFor="data">Date: </label>
      <input value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={getAppointments}>View Appointment</button>
      <button>Make Appointment</button>
      {renderAppointments()}
    </div>
  );
};

export default Doctor;
