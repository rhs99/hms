import { useNavigate, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { Avatar, Heading, Flex, Text } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';

import { FiLogOut } from 'react-icons/fi';
import { FaRegUser, FaHospital } from 'react-icons/fa';

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
      style={{
        padding: 'var(--spacing-lg) var(--spacing-2xl)',
        backgroundColor: 'var(--color-white)',
        borderBottom: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        gap="12"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <FaHospital size={28} style={{ color: 'var(--color-primary)' }} />
        <Flex flexDirection="column" gap="0">
          <Heading
            level="4"
            style={{ margin: 0, color: 'var(--color-primary-dark)', fontWeight: 'var(--font-weight-bold)' }}
          >
            HMS
          </Heading>
          <Text fontSize="xs" style={{ color: 'var(--color-text-tertiary)', marginTop: '-4px' }}>
            Healthcare Management
          </Text>
        </Flex>
      </Flex>
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
                  label: 'Profile',
                  execute: () => navigate(`/users/${authCtx.getStoredValue().userName}`),
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
                <Avatar size="lg" name={authCtx.getStoredValue().userName} style={{ cursor: 'pointer' }} />
              </MenuTrigger>
              <MenuContent />
            </Menu>
          </Flex>
        ) : (
          <Flex flexDirection="row" justifyContent="center" gap="16" alignItems="center">
            <NavLink
              to="/sign-in"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                border: '2px solid var(--color-primary)',
                transition: 'var(--transition-fast)',
              })}
              onMouseEnter={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-lighter)';
                }
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Sign In
            </NavLink>
            <NavLink
              to="/sign-up"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                border: '2px solid var(--color-primary)',
                transition: 'var(--transition-fast)',
              })}
              onMouseEnter={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-lighter)';
                }
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
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
