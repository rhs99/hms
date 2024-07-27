import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import { AuthContextProvider } from './store/auth';
import Navigation from './component/navigation/Navigation';
import Homepage from './pages/Homepage';
import Hospital from './pages/Hospital';
import Branch from './pages/Branch';
import Department from './pages/Department';
import Doctor from './pages/doctor/Doctor';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import Activities from './pages/activities/Activities';

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <hr></hr>
      <main
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
        }}
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
          { path: '/hospitals/:hospitalId', element: <Hospital /> },
          { path: '/hospitals/:hospitalId/branches/:branchId', element: <Branch /> },
          { path: '/hospitals/:hospitalId/branches/:branchId/departments/:deptId', element: <Department /> },
          {
            path: '/hospitals/:hospitalId/branches/:branchId/departments/:deptId/doctors/:doctorId',
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
