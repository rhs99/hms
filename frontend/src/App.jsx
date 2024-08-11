import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import { AuthContextProvider } from './store/auth';
import Navigation from './component/navigation/Navigation';
import Homepage from './pages/homepage/Homepage';
import Branch from './pages/Branch';
import Doctor from './pages/doctor/Doctor';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import Activities from './pages/activities/Activities';
import Workplace from './pages/workplace/Workplace';

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <hr></hr>
      <main
        style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '60%', display: 'flex', justifyContent: 'center' }}
      >
        <Outlet />
      </main>
    </>
  );
};

const ErrorPage = () => {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Homepage /> },
          { path: '/sign-up', element: <SignUp /> },
          { path: '/sign-in', element: <SignIn /> },
          { path: '/activities', element: <Activities /> },
          { path: '/workplaces', element: <Workplace /> },
          { path: '/branches/:branchId', element: <Branch /> },
          {
            path: '/branches/:branchId/departments/:deptId/doctors/:doctorId',
            element: <Doctor />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />;
    </AuthContextProvider>
  );
};

export default App;
