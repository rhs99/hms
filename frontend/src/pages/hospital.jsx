import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Config from '../config';
import Table from '../design-library/table/Table';

const Hospital = () => {
  const [branches, setBranches] = useState([]);
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branches?hospital_id=${hospitalId}`;
    axios.get(url).then(({ data }) => {
      setBranches(data);
    });
  }, [hospitalId]);

  return (
    <Table
      title="Branches"
      headers={['Address', 'Phone', 'Email']}
      rows={branches.map((branch) => {
        return {
          key: branch.id,
          value: [branch.address, branch.phone, branch.email],
        };
      })}
      onRowClick={(id) => {
        navigate(`/hospitals/${hospitalId}/branches/${id}`);
      }}
    />
  );
};

export default Hospital;
