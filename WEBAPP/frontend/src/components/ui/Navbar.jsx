import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from './sheet.jsx';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Nav Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              SkillShare
            </Link>
            <div className="hidden sm:flex space-x-6 text-sm font-medium">
              <Link to="/" className="text-gray-800 hover:text-blue-600 transition">Home</Link>
              <Link to="/explore" className="text-gray-600 hover:text-blue-600 transition">Explore</Link>
              {user && (
                <>
                  <Link to="/marketplace" className="text-gray-600 hover:text-blue-600 transition">Marketplace</Link>
                  <Link to="/doubt" className="text-gray-600 hover:text-blue-600 transition">Doubtplace</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-5 mt-6 text-base font-medium">
                  <Link to="/" className="text-gray-800">Home</Link>
                  <Link to="/explore" className="text-gray-600 hover:text-blue-600">Explore</Link>
                  {user && (
                    <>
                      <Link to="/marketplace" className="text-gray-600 hover:text-blue-600">Marketplace</Link>
                      <Link to="/doubt" className="text-gray-600 hover:text-blue-600">Doubtplace</Link>
                      <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </>
                  )}
                  {!user && (
                    <>
                      <Link to="/login" className="text-blue-600 hover:text-blue-700">Login</Link>
                      <Link to="/register" className="text-blue-600 hover:text-blue-700">Sign Up</Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <div className="relative">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="font-semibold">{user.full_name}</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
