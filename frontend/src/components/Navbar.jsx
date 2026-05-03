import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">SmartHire</span>
              <span className="text-xs text-blue-600 font-semibold tracking-wide -mt-1">AI Job Portal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              🔍 Browse Jobs
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === "recruiter" ? "/recruiter-dashboard" : "/dashboard"}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  📋 Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{user.name?.split(" ")[0]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === "recruiter" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {user.role}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started Free 🚀</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1.5 rounded"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1.5 rounded"></div>
            <div className="w-5 h-0.5 bg-gray-600 rounded"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link to="/jobs" className="block text-gray-600 hover:text-blue-600 font-medium py-2">🔍 Browse Jobs</Link>
            {user ? (
              <>
                <Link to={user.role === "recruiter" ? "/recruiter-dashboard" : "/dashboard"} className="block text-gray-600 hover:text-blue-600 font-medium py-2">📋 Dashboard</Link>
                <button onClick={handleLogout} className="block text-red-500 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 font-medium py-2">Login</Link>
                <Link to="/register" className="block text-blue-600 font-medium py-2">Get Started Free 🚀</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
