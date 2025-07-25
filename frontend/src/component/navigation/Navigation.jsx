import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {Button, Badge} from '@optiaxiom/react';

import AuthContext from '../../store/auth';

import './_index.scss';

const Navigation = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { isLoggedIn, logout } = authCtx;

  const handleLogOut = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <h1 className="navigation-title" onClick={() => navigate('/')}>
        Healthcare Management System
      </h1>
      <div className="navigation-btn-container">
        {isLoggedIn ? (
          <div className="navigation-btn-grp">
            <Button onClick={() => navigate('/activities')}>Activities</Button>
            <Button onClick={() => navigate('/workplaces')}>Work Places</Button>
            <Button onClick={handleLogOut}>Log Out</Button>
            <Badge>{authCtx.getStoredValue().userName}</Badge>
          </div>
        ) : (
          <div className="navigation-btn-grp">
            <Button className="navigation-sign-in" onClick={() => navigate('/sign-in')}>
              Sign In
            </Button>
            <Button className="navigation-sign-up" onClick={() => navigate('/sign-up')}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
