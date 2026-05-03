import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">SH</span>
            </div>
            <div>
              <div className="font-extrabold text-xl text-white">SmartHire</div>
              <div className="text-xs text-blue-400 font-semibold -mt-1">AI Job Portal</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            🤖 AI-powered skill matching connects the right talent with the right opportunity. Built with the MERN stack.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["MongoDB", "Express", "React", "Node.js"].map(t => (
              <span key={t} className="text-xs bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full border border-blue-800">{t}</span>
            ))}
          </div>
        </div>

        {/* Job Seekers */}
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Job Seekers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs"      className="hover:text-white transition-colors">🔍 Browse Jobs</Link></li>
            <li><Link to="/register"  className="hover:text-white transition-colors">👤 Register</Link></li>
            <li><Link to="/login"     className="hover:text-white transition-colors">🔐 Login</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">📋 My Dashboard</Link></li>
          </ul>
        </div>

        {/* Recruiters */}
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Recruiters</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register"            className="hover:text-white transition-colors">🏢 Post a Job</Link></li>
            <li><Link to="/recruiter-dashboard" className="hover:text-white transition-colors">📊 Dashboard</Link></li>
            <li><Link to="/jobs"                className="hover:text-white transition-colors">👥 Find Talent</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-sm text-gray-500">&copy; 2024 SmartHire AI Job Portal. All rights reserved.</p>
        <p className="text-sm text-gray-500">Built with ❤️ using MERN Stack &bull; Final Year Project</p>
      </div>
    </div>
  </footer>
);

export default Footer;
