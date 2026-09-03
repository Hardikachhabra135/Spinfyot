import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Students from './pages/Students';
import AssignedStudents from './pages/AssignedStudents';
import EnrolledStudents from './pages/EnrolledStudents';
import CallBacks from './pages/CallBacks';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('counsellorToken'));
  const [counsellor, setCounsellor] = useState(JSON.parse(localStorage.getItem('counsellorData')) || null);

  const login = (newToken, data) => {
    localStorage.setItem('counsellorToken', newToken);
    localStorage.setItem('counsellorData', JSON.stringify(data));
    setToken(newToken);
    setCounsellor(data);
  };

  const logout = () => {
    localStorage.removeItem('counsellorToken');
    localStorage.removeItem('counsellorData');
    setToken(null);
    setCounsellor(null);
  };

  return (
    <AuthContext.Provider value={{ token, counsellor, login, logout }}>
      <Router>
        <Routes>
          <Route path="/c/:slug/login" element={token ? <Navigate to={`/c/${counsellor?.slug}`} /> : <Login />} />
          <Route path="/login" element={token ? <Navigate to={`/c/${counsellor?.slug}`} /> : <Login />} />
          
          <Route path="/c/:slug/*" element={
            <PrivateRoute>
              <CounsellorApp />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

function CounsellorApp() {
  const { slug } = useParams();
  const { counsellor, logout } = useAuth();

  // If they visit a different counsellor's URL, log them out to allow signing in as the new one
  if (counsellor && counsellor.slug !== slug) {
    logout();
    return <Navigate to={`/c/${slug}/login`} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar slug={slug} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/assigned" element={<AssignedStudents />} />
          <Route path="/enrolled" element={<EnrolledStudents />} />
          <Route path="/callbacks" element={<CallBacks />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
