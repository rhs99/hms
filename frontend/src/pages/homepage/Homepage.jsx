import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '../../design-library/table/Table';
import Config from '../../config';

import './_index.scss';

const Homepage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [matchedHospitals, setMatchedHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + '/hospitals';
    axios.get(url).then(({ data }) => {
      setHospitals(data);
      setMatchedHospitals(data);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setMatchedHospitals(hospitals);
    } else {
      const matched = hospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
      setMatchedHospitals(matched);
    }
  }, [searchTerm]);

  return (
    <div className="homepage">
      <input
        className="homepage-search-box"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table
        title="Hospitals"
        headers={['Name', 'Branch Location', 'Phone', 'Email']}
        rows={matchedHospitals.map((h) => {
          return {
            key: h.branch_id,
            value: [h.name, h.address, h.phone, h.email],
          };
        })}
        onRowClick={(id) => {
          navigate(`/branches/${id}`);
        }}
      />
    </div>
  );
};

export default Homepage;
