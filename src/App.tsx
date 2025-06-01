import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Registration System</h1>
            <div className="space-x-4">
              <Link
                to="/"
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Registration Form
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route
              path="/admin"
              element={
                !isAdmin ? (
                  <Navigate to="/dashboard\" replace />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                !isAdmin ? (
                  <AdminDashboard onLogout={handleAdminLogout} />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;