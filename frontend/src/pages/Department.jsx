import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Table from '../design-library/table/Table';

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
    <Table
      title="Doctors"
      headers={['Name', 'Degree', 'Experience']}
      rows={doctors.map((doctor) => {
        return {
          key: doctor.id,
          value: [doctor.name, doctor.degree, doctor.experience],
        };
      })}
      onRowClick={(id) => {
        navigate(`/hospitals/${hospitalId}/branches/${branchId}/departments/${deptId}/doctors/${id}`);
      }}
    />
  );
};

export default Department;
