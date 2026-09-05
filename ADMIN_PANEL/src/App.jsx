import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Appointments from './pages/Appointments';
import Questions from './pages/Questions';
import TestimonialsAdmin from './pages/TestimonialsAdmin';
import BlogsAdmin from './pages/BlogsAdmin';
import InfluencerLinks from './pages/InfluencerLinks';
import Counsellors from './pages/Counsellors';
import AssignCounsellor from './pages/AssignCounsellor';
import TalkToCounselor from './pages/TalkToCounselor';

// Create a simple Auth Context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/*" element={
            <PrivateRoute>
              <div className="flex h-screen overflow-hidden bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/assign-counsellor" element={<AssignCounsellor />} />
                    <Route path="/questions" element={<Questions />} />
                    <Route path="/testimonials" element={<TestimonialsAdmin />} />
                    <Route path="/blogs" element={<BlogsAdmin />} />
                    <Route path="/influencer-links" element={<InfluencerLinks />} />
                    <Route path="/counsellors" element={<Counsellors />} />
                    <Route path="/chat" element={<TalkToCounselor />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
