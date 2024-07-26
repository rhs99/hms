import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Config from '../config';


const Homepage = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + '/hospitals';
    axios.get(url).then(({ data }) => {
      setHospitals(data);
    })
  }, [])

  return (
    <div className='homepage'>
      <h3>List of Hospitals</h3>
      <table>
        <thead>
          <tr><th>Name</th></tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => {
            return (
              <tr key={hospital.id} onClick={() => navigate(`/hospitals/${hospital.id}`)} ><td>{hospital.name}</td></tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Homepage;