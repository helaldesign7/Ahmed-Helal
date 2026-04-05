import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();

  // If no user is logged in or role is not admin, redirect to public home
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/" replace />;
  }


  // Otherwise, render the nested routes (Admin Layout)
  return <Outlet />;
};
