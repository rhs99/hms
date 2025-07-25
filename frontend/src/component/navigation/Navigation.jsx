import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Box, Button, Badge, Heading, Flex } from '@optiaxiom/react';

import AuthContext from '../../store/auth';

const Navigation = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { isLoggedIn, logout } = authCtx;

  const handleLogOut = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" style={{ padding: '10px' }}>
      <Heading level="3" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Healthcare Management System
      </Heading>
      <>
        {isLoggedIn ? (
          <Flex flexDirection="row" justifyContent="center" gap="12">
            <Button onClick={() => navigate('/activities')}>Activities</Button>
            <Button onClick={() => navigate('/workplaces')}>Work Places</Button>
            <Button onClick={handleLogOut}>Log Out</Button>
            <Badge>{authCtx.getStoredValue().userName}</Badge>
          </Flex>
        ) : (
          <Flex flexDirection="row" justifyContent="center" gap="12">
            <Button onClick={() => navigate('/sign-in')}>Sign In</Button>
            <Button onClick={() => navigate('/sign-up')}>Sign Up</Button>
          </Flex>
        )}
      </>
    </Flex>
  );
};

export default Navigation;
