import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  // useLocation vadatam valla route marinappudalla Navbar auto ga update avtundi
  const location = useLocation(); 
  
  // Local storage lo token undo ledo check chestunnam
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    // Logout nokkagane tokens delete chesi, login page ki pampistunnam
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">ATS Platform</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
            
            {/* Login ayyi unte Dashboard & Recruiter links chupistam */}
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">Dashboard</Link>
                <Link to="/recruiter" className="text-purple-600 hover:text-purple-800 font-bold transition">Recruiter View</Link>
              </>
            )}

            {/* Dynamic Auth Buttons */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-medium hover:bg-red-100 transition shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;