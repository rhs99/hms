import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Config from '../config';

const Department = () => {
  const [doctors, setDoctors] = useState([]);
  const { branchId, deptId, hospitalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts/doctors?branch_id=${branchId}&dept_id=${deptId}`;
    axios.get(url).then(({ data }) => {
      setDoctors(data);
    });
  }, [branchId]);

  return (
    <div>
      <h2>Doctors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Degree</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            return (
              <tr
                key={doctor.id}
                onClick={() =>
                  navigate(`/hospitals/${hospitalId}/branches/${branchId}/departments/${deptId}/doctors/${doctor.id}`)
                }
              >
                <td>{doctor.name}</td>
                <td>{doctor.degree}</td>
                <td>{doctor.experience}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Department;
