import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '../design-library/table/Table';

import Config from '../config';

const Homepage = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + '/hospitals';
    axios.get(url).then(({ data }) => {
      setHospitals(data);
    });
  }, []);

  return (
    <Table
      title="Hospitals"
      headers={['Name']}
      rows={hospitals.map((h) => {
        return {
          key: h.id,
          value: [h.name],
        };
      })}
      onRowClick={(id) => {
        navigate(`/hospitals/${id}`);
      }}
    />
  );
};

export default Homepage;
