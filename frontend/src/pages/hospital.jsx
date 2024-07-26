import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Config from "../config";

const Hospital = () => {
  const [branches, setBranches] = useState([]);
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branches?hospital_id=${hospitalId}`;
    axios.get(url).then(({ data }) => {
      setBranches(data);
    })
  }, [hospitalId])


  return <div>
    <h2>Branches</h2>
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => {
          return (
            <tr key={branch.id} onClick={()=>navigate(`/hospitals/${hospitalId}/branches/${branch.id}`)}>
              <td>{branch.address}</td>
              <td>{branch.phone}</td>
              <td>{branch.email}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
}

export default Hospital;