import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../design-library/table/Table';

import Config from '../config';

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const { branchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts?branch_id=${branchId}`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  }, [branchId]);

  const getDoctors = async (id) => {
    const url = Config.SERVER_URL + `/branch-depts/doctors?branch_id=${branchId}&dept_id=${id}`;
    const { data } = await axios.get(url);
    setDoctors(data);
  };

  return (
    <div style={{ display: 'flex', gap: '100px' }}>
      <Table
        title="Departments"
        headers={['Name']}
        rows={depts.map((dept) => {
          return {
            key: dept.id,
            value: [dept.name],
          };
        })}
        highlightSelection={true}
        onRowClick={async (id) => {
          await getDoctors(id);
          setSelectedDeptId(id);
        }}
      />

      {selectedDeptId && (
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
            navigate(`/branches/${branchId}/departments/${selectedDeptId}/doctors/${id}`);
          }}
        />
      )}
    </div>
  );
};

export default Branch;
