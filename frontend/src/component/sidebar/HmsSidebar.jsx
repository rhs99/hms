import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Nav, NavBody, NavFooter, NavItem, NavList, Sidebar, SidebarToggle } from '@optiaxiom/react';
import { TbLayoutSidebar, TbTimelineEventText, TbHome } from 'react-icons/tb';
import { RiHomeOfficeLine } from 'react-icons/ri';

import AuthContext from '../../store/auth';

const HmsSidebar = () => {
  const [selected, setSelected] = useState('activities');

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoggedIn } = authCtx;

  const goToHome = () => {
    setSelected('home');
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

  return (
    <Box style={{ maxWidth: '250px', height: 'calc(100vh - 100px)' }}>
      <Sidebar defaultExpanded>
        <Nav>
          <NavBody>
            <NavList>
              <NavItem active={selected === 'home'} icon={<TbHome />} onClick={goToHome}>
                Home
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
