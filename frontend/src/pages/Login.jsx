import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [role, setRole] = useState('ROLE_CANDIDATE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const userData = response.data; // { token, id, name, email, role }
      
      // Ensure the user is logging into the correct portal
      if (userData.role !== role) {
        setError(`Access Denied! You are registered as a ${userData.role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}. Please select the correct role.`);
        return;
      }

      // Save token and state via context
      login(userData.token, { id: userData.id, email: userData.email, role: userData.role });

      // Redirect to appropriate dashboard
      if (userData.role === 'ROLE_RECRUITER') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
         setError('Invalid credentials.');
      } else {
         setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please login to your account</p>

        <div className="role-toggle">
          <button 
            type="button"
            className={`role-btn ${role === 'ROLE_CANDIDATE' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_CANDIDATE')}
          >
            Candidate
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'ROLE_RECRUITER' ? 'active' : ''}`}
            onClick={() => setRole('ROLE_RECRUITER')}
          >
            Recruiter
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login as {role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Sign up here</Link>
        </div>
      </div>
    </div>
  );
}
