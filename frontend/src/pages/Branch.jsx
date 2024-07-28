import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../design-library/table/Table';

import Config from '../config';

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const { branchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts?branch_id=${branchId}`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  }, [branchId]);

  return (
    <Table
      title="Departments"
      headers={['Name']}
      rows={depts.map((dept) => {
        return {
          key: dept.id,
          value: [dept.name],
        };
      })}
      onRowClick={(id) => {
        navigate(`/branches/${branchId}/departments/${id}`);
      }}
    />
  );
};

export default Branch;
