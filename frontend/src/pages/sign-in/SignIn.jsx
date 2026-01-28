import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Box, Input, Field, Text } from '@optiaxiom/react';
import { FaUserMd } from 'react-icons/fa';

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
      <Box className="signIn-header">
        <Box className="signIn-icon">
          <FaUserMd size={48} />
        </Box>
        <Text className="signIn-title">Welcome Back</Text>
        <Text className="signIn-subtitle">Sign in to access your healthcare portal</Text>
      </Box>
      <form onSubmit={handleSignIn} className="signIn-form">
        <Field label="User Name">
          <Input
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button appearance="primary" type="submit" className="signIn-submit-button">
          Sign In
        </Button>
      </form>
      <Box className="signIn-footer">
        <Text>
          Don't have an account?{' '}
          <Link to="/sign-up" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default SignIn;
