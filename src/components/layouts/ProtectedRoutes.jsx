import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const DonorRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/donor" state={{ from: location }} replace />;
  }

  if (auth.role !== 'donor') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const BeneficiaryRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/beneficiary" state={{ from: location }} replace />;
  }

  if (auth.role !== 'beneficiary') {
    return <Navigate to="/" replace />;
  }

  return children;
};