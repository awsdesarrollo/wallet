import { useContext } from 'react';
import { Navigate, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context';
import Login from '../screens/auth/login';
import Logout from '../screens/auth/logout';
import Recover from '../screens/auth/recover-password';
import Home from '../screens/home/home';
import Users from '../screens/users/users';
import EditUser from '../screens/users/edit-user';
import Orders from '../screens/orders/orders';
import Layout from './layout';

const Router = () => {
  const { isLogged } = useContext(AuthContext);

  const authRouter = createBrowserRouter([
    {
      index: true,
      path: '/login',
      element: <Login />,
    },
    {
      path: '/recover/:code',
      element: <Recover />,
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    }
  ], { basename: process.env.REACT_APP_BASENAME });

  const adminRouter = createBrowserRouter([
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      index: true,
      path: '*',
      Component: AdminRoutes,
    },
  ], { basename: process.env.REACT_APP_BASENAME });

  return (
    <RouterProvider router={isLogged ? adminRouter : authRouter} />
  )
}

const AdminRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="/usuarios/:id/editar" element={<EditUser />} />
      <Route path="/transacciones" element={<Orders />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default Router;