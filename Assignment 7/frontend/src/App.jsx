import { useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackFormPage from './pages/FeedbackFormPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LogOut } from 'lucide-react';
import './index.css';

function MainLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Student Feedback Review System</h1>
        </div>
        {user && (
          <div className="nav-user">
            <span className="user-name">Hello, {user.name || user.fullName} ({user.role})</span>
            <button className="btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={
          user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student" />) 
               : <Navigate to="/login" />
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/student/feedback/:assignmentId" element={
          <ProtectedRoute role="student">
            <FeedbackFormPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </MainLayout>
  );
}

export default App;
