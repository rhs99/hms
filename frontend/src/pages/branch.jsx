import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Config from "../config";

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const { branchId, hospitalId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts?branch_id=${branchId}`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    })
  }, [branchId])


  return <div>
    <h2>Departments</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {depts.map((dept) => {
          return (
            <tr key={dept.id}
              onClick={()=>navigate(`/hospitals/${hospitalId}/branches/${branchId}/departments/${dept.id}`)}
            >
              <td>{dept.name}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
}

export default Branch;