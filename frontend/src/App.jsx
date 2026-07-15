import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> 
      
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard ni ProtectedRoute tho lock chesam */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/recruiter" 
  element={
    <ProtectedRoute>
      <RecruiterDashboard />
    </ProtectedRoute>
  } 
/>
        </Routes>
      </main>
    </div>
  );
}

export default App;