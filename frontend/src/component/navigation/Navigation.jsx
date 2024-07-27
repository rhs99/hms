import { useNavigate } from 'react-router-dom';

import './_index.scss';

const Navigation = () => {
  const navigate = useNavigate();

  const isLoggedIn = true;

  return (
    <nav className="navigation">
      <h1 className="navigation-title" onClick={() => navigate('/')}>
        Healthcare Management System
      </h1>
      <div className="navigation-btn-container">
        {isLoggedIn ? (
          <div className="navigation-btn-grp">
            <button className="navigation-sign-in">Sign In</button>
            <button className="navigation-sign-up" onClick={() => navigate('/sign-up')}>
              Sign Up
            </button>
          </div>
        ) : (
          <div className="navigation-btn-grp">
            <button>Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
