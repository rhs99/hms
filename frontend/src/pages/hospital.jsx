import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Config from "../config";

const Hospital = () => {
  const [branches, setBranches] = useState([]);
  const { hospitalId } = useParams();

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
            <tr key={branch.id}>
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