import axios from 'axios'
import { useState, useEffect } from 'react';

import Config from './config';


const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const url = Config.SERVER_URL + '/hospitals';
    axios.get(url).then(({ data }) => {
      setHospitals(data);
    })
  }, [])

  const fetchBranches = (id) => {
    const url = Config.SERVER_URL + `/branches?hospital_id=${id}`;
    axios.get(url).then(({ data }) => {
      setBranches(data);
    })
  }

  const renderHospitals = () => {
    return <table>
      <thead>
        <tr><th>Hospitals</th></tr>
      </thead>
      <tbody>
        {hospitals.map((hospital) => {
          return (
            <tr key={hospital.id}><td onClick={() => fetchBranches(hospital.id)}>{hospital.name}</td></tr>
          )
        })}
      </tbody>
    </table>
  }

  const renderBranches = () => {
    return <table>
      <thead>
        <tr><th>Branches</th></tr>
      </thead>
      <tbody>
        {branches.length > 0 ? branches.map((branch) => {
          return (
            <tr key={branch.id} onClick={() => fetchBranches(branch.id)}>
              <td>{branch.address}</td>
              <td>{branch.phone}</td>
              <td>{branch.email}</td>
            </tr>
          )
        }) : <tr><td>No branch found!</td></tr>}
      </tbody>
    </table>
  }

  return (
    <>
      {renderHospitals()}
      <br></br>
      {renderBranches()}
    </>
  )
}


function App() {
  return (
    <>
      <h1>Healthcare Management System</h1>
      <Hospitals />
    </>
  );
}

export default App;
