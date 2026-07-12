import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Local storage nunchi token ni testunnam
  const token = localStorage.getItem('access_token');

  // Token lekapothe, direct ga login page ki pampisthundi
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token unte, vallu adigina page (Dashboard) ni chupisthundi
  return children;
};

export default ProtectedRoute;