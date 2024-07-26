import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Config from '../config';

const Doctor = () => {
  const [slots, setSlots] = useState([]);
  const { branchId, hospitalId, doctorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/slot-schedules?branch_id=${branchId}&employee_id=${doctorId}`;
    axios.get(url).then(({ data }) => {
      setSlots(data);
    });
  }, [branchId]);

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
          {slots.map((slot) => {
            return (
              <tr key={slot.id}>
                <td>{slot.start_at}</td>
                <td>{slot.end_at}</td>
                <td>{slot.day}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Doctor;
