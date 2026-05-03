import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import UserDashboard from "./pages/UserDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/register"  element={<Register />} />
              <Route path="/jobs"      element={<Jobs />} />
              <Route path="/jobs/:id"  element={<JobDetails />} />
              <Route path="/dashboard" element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recruiter-dashboard" element={
                <ProtectedRoute role="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">404</div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h2>
                  <a href="/" className="text-blue-600 hover:underline">Go back home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
