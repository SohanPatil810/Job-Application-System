import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';

// Placeholder dashboards (will be built in later phases)
const Home = () => <div style={{ padding: '2rem' }}><h2>Welcome to HireHub</h2><a href="/login">Go to Login</a></div>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Candidate Routes */}
        <Route 
          path="/candidate" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Recruiter Routes */}
        <Route 
          path="/recruiter" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
