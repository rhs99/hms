import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Nav, NavBody, NavFooter, NavItem, NavList, Sidebar, SidebarToggle } from '@optiaxiom/react';
import { TbLayoutSidebar, TbTimelineEventText, TbHome, TbShieldCog } from 'react-icons/tb';
import { RiHomeOfficeLine } from 'react-icons/ri';

import AuthContext from '../../store/auth';
import { useMediaQuery } from '../useMediaQuery';

const HmsSidebar = () => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <Box style={{ maxWidth: '250px', height: 'calc(100vh - 100px)' }}>
      <Sidebar key={isDesktop ? 'desktop' : 'mobile'} defaultExpanded={isDesktop}>
        <Nav>
          <NavBody>
            <NavList>
              <NavItem active={isActive('/')} icon={<TbHome />} onClick={() => navigate('/')}>
                Hospitals
              </NavItem>
              {isLoggedIn && (
                <NavItem
                  active={isActive('/activities')}
                  icon={<TbTimelineEventText />}
                  onClick={() => navigate('/activities')}
                >
                  Activities
                </NavItem>
              )}
              {isLoggedIn && (
                <NavItem
                  active={isActive('/workplaces')}
                  icon={<RiHomeOfficeLine />}
                  onClick={() => navigate('/workplaces')}
                >
                  Workplaces
                </NavItem>
              )}
              {isLoggedIn && isAdmin && (
                <NavItem
                  active={isActive('/admin')}
                  icon={<TbShieldCog />}
                  onClick={() => navigate('/admin')}
                >
                  Administration
                </NavItem>
              )}
            </NavList>
          </NavBody>

          <NavFooter>
            <NavList>
              <SidebarToggle icon={<TbLayoutSidebar />} />
            </NavList>
          </NavFooter>
        </Nav>
      </Sidebar>
    </Box>
  );
};

export default HmsSidebar;
