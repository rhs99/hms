import { useNavigate, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { Avatar, Button, Heading, Flex, Text } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';

import { FiLogOut } from 'react-icons/fi';
import { FaRegUser, FaHospital, FaMoon, FaSun } from 'react-icons/fa';

import AuthContext from '../../store/auth';
import { useColorScheme } from '../useColorScheme';

const HmsHeader = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { scheme, toggle } = useColorScheme();

  const { isLoggedIn, logout } = authCtx;
  const isDark = scheme === 'dark';

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
        backgroundColor: 'var(--ax-colors-bg-default)',
        borderBottom: '2px solid var(--ax-colors-fg-accent-strong)',
        boxShadow: 'var(--ax-boxShadow-md)',
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
        <FaHospital size={28} style={{ color: 'var(--ax-colors-fg-accent-strong)' }} />
        <Flex flexDirection="column" gap="0">
          <Heading
            level="4"
            style={{ margin: 0, color: 'var(--ax-colors-fg-accent-strong)', fontWeight: 'var(--font-weight-bold)' }}
          >
            HMS
          </Heading>
          <Text fontSize="xs" style={{ color: 'var(--ax-colors-fg-tertiary)', marginTop: '-4px' }}>
            Healthcare Management
          </Text>
        </Flex>
      </Flex>
      <Flex flexDirection="row" alignItems="center" gap="12">
        <Button
          appearance="subtle"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={isDark ? <FaSun /> : <FaMoon />}
          onClick={toggle}
        />
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
                color: isActive ? 'var(--ax-colors-bg-default)' : 'var(--ax-colors-fg-accent-strong)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 20px',
                borderRadius: 'var(--ax-borderRadius-md)',
                backgroundColor: isActive ? 'var(--ax-colors-fg-accent-strong)' : 'transparent',
                border: '2px solid var(--ax-colors-fg-accent-strong)',
                transition: 'var(--transition-fast)',
              })}
              onMouseEnter={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--ax-colors-bg-accent-subtle)';
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
                color: isActive ? 'var(--ax-colors-bg-default)' : 'var(--ax-colors-fg-accent-strong)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 20px',
                borderRadius: 'var(--ax-borderRadius-md)',
                backgroundColor: isActive ? 'var(--ax-colors-fg-accent-strong)' : 'transparent',
                border: '2px solid var(--ax-colors-fg-accent-strong)',
                transition: 'var(--transition-fast)',
              })}
              onMouseEnter={(e) => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--ax-colors-bg-accent-subtle)';
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
      </Flex>
    </Flex>
  );
};

export default HmsHeader;
