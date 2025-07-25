import { useNavigate, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { Button, Badge, Heading, Flex } from '@optiaxiom/react';

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
            <NavLink
              to="/activities"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'darkblue' : 'blue',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Activities
            </NavLink>
            <NavLink
              to="/workplaces"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'darkblue' : 'blue',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Work Places
            </NavLink>
            <Button onClick={handleLogOut}>Log Out</Button>
            <Badge>{authCtx.getStoredValue().userName}</Badge>
          </Flex>
        ) : (
          <Flex flexDirection="row" justifyContent="center" gap="12">
            <NavLink
              to="/sign-in"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'darkblue' : 'blue',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Sign In
            </NavLink>
            <NavLink
              to="/sign-up"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'darkblue' : 'blue',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              Sign Up
            </NavLink>
          </Flex>
        )}
      </>
    </Flex>
  );
};

export default Navigation;
