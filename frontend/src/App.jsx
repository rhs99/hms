import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import Homepage from "./pages/homepage";
import Hospital from './pages/hospital';
import Branch from './pages/branch';


const RootLayout = () => {
  return (
    <>
      <h1 style={{ marginLeft: '30px' }}>Healthcare Management System</h1>
      <hr></hr>
      <main style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
      }}>
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
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
