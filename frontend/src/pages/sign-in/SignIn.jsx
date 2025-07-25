import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Input, Field, Text } from '@optiaxiom/react';

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
    <Box className="signIn">
      <Text className="signIn-title">Sign In</Text>
      <form onSubmit={handleSignIn} className="signIn-form">
        <Field label="User Name">
          <Input
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

export default SignIn;
