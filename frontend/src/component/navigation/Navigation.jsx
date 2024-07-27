import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

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
            <button onClick={() => navigate('/activities')}>Activities</button>
            <button onClick={() => navigate('/workplaces')}>Work Places</button>
            <button onClick={handleLogOut}>Log Out</button>
          </div>
        ) : (
          <div className="navigation-btn-grp">
            <button className="navigation-sign-in" onClick={() => navigate('/sign-in')}>
              Sign In
            </button>
            <button className="navigation-sign-up" onClick={() => navigate('/sign-up')}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
