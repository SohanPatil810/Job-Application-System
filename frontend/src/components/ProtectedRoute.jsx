import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // 1. User is not logged in -> redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 2. User is logged in, but doesn't have the required role (e.g., Candidate trying to view Recruiter page)
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. User is authorized -> render the protected component
  return children;
};

export default ProtectedRoute;
