import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { AxiomProvider, Box, Text } from '@optiaxiom/react';

import { AuthContextProvider } from './store/auth';
import HmsHeader from './component/header/HmsHeader';
import Homepage from './pages/homepage/Homepage';
import Branch from './pages/branch/Branch';
import Doctor from './pages/doctor/Doctor';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import Activities from './pages/activities/Activities';
import Workplace from './pages/workplace/Workplace';
import HmsSidebar from './component/sidebar/HmsSidebar';
import Profile from './pages/profile/Profile';

import { Layout, LayoutContent } from '@optiaxiom/react/unstable';

const RootLayout = () => {
  return (
    <Layout header={<HmsHeader />} sidebar={<HmsSidebar />} size="full">
      <LayoutContent>
        <Outlet />
      </LayoutContent>
    </Layout>
  );
};

const ErrorPage = () => {
  return (
    <Box id="error-page">
      <Text>Oops!</Text>
      <Text color="fg.tertiary">Sorry, an unexpected error has occurred.</Text>
    </Box>
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
          { path: '/users/:userName', element: <Profile /> },
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
    <AxiomProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </AxiomProvider>
  );
};

export default App;
