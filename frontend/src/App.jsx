import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import Navigation from './component/navigation/Navigation';
import Homepage from './pages/Homepage';
import Hospital from './pages/Hospital';
import Branch from './pages/Branch';
import Department from './pages/Department';
import Doctor from './pages/doctor/Doctor';

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
  return <RouterProvider router={router} />;
};

export default App;
