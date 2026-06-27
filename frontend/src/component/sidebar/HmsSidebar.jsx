import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Nav, NavBody, NavFooter, NavItem, NavList, Sidebar, SidebarToggle } from '@optiaxiom/react';
import { TbLayoutSidebar, TbTimelineEventText, TbHome, TbSettings } from 'react-icons/tb';
import { RiHomeOfficeLine } from 'react-icons/ri';

import AuthContext from '../../store/auth';
import { useMediaQuery } from '../useMediaQuery';

const HmsSidebar = () => {
  const [selected, setSelected] = useState('activities');

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { isLoggedIn } = authCtx;

  const goToHospitals = () => {
    setSelected('hospitals');
    navigate('/');
  };

  const goToActivities = () => {
    setSelected('activities');
    navigate('/activities');
  };

  const goToWorkplaces = () => {
    setSelected('workplaces');
    navigate('/workplaces');
  };

  const goToSettings = () => {
    setSelected('settings');
    navigate('/settings');
  };

  return (
    <Box style={{ maxWidth: '250px', height: 'calc(100vh - 100px)' }}>
      <Sidebar key={isDesktop ? 'desktop' : 'mobile'} defaultExpanded={isDesktop}>
        <Nav>
          <NavBody>
            <NavList>
              <NavItem active={selected === 'hospitals'} icon={<TbHome />} onClick={goToHospitals}>
                Hospitals
              </NavItem>
              {isLoggedIn && (
                <NavItem active={selected === 'activities'} icon={<TbTimelineEventText />} onClick={goToActivities}>
                  Activities
                </NavItem>
              )}
              {isLoggedIn && (
                <NavItem active={selected === 'workplaces'} icon={<RiHomeOfficeLine />} onClick={goToWorkplaces}>
                  Workplaces
                </NavItem>
              )}
              {isLoggedIn && (
                <NavItem active={selected === 'settings'} icon={<TbSettings />} onClick={goToSettings}>
                  Settings
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
