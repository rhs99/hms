import { useNavigate, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { Button, Badge, Heading, Flex } from '@optiaxiom/react';
import { EllipsisMenuButton, Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';

import { FiLogOut } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';

import AuthContext from '../../store/auth';

const HmsHeader = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { isLoggedIn, logout } = authCtx;

  const handleLogOut = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ padding: '10px', backgroundColor: 'white', borderBottom: '1px solid #ccc' }}
    >
      <Heading level="4" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Healthcare Management System
      </Heading>
      <>
        {isLoggedIn ? (
          <Flex flexDirection="row" justifyContent="center" gap="12">
            <Menu
              options={[
                {
                  addon: <FaRegUser />,
                  group: {
                    label: 'My Account',
                  },
                  label: 'View Profile',
                },
                {
                  addon: <FiLogOut />,
                  group: {
                    hidden: true,
                    label: 'Logout',
                    separator: true,
                  },
                  label: 'Logout',
                  execute: () => handleLogOut(),
                },
              ]}
            >
              <MenuTrigger asChild>
                <Badge style={{ cursor: 'pointer' }}>{authCtx.getStoredValue().userName}</Badge>
              </MenuTrigger>
              <MenuContent />
            </Menu>
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

export default HmsHeader;
