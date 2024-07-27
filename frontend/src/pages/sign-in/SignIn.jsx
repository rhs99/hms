import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../store/auth';
import Config from '../../config';

import './_index.scss';

const SignIn = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    const URL = Config.SERVER_URL + '/users/sign-in';
    const data = {
      user_name: userName,
      password: password,
    };

    axios.post(URL, data).then(({ data }) => {
      authCtx.login(data.user_name, data.id);
      navigate('/');
    });
  };

  return (
    <div className="signIn">
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input placeholder="Enter user name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <input placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignIn;
