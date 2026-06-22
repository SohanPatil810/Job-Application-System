import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const [role, setRole] = useState('ROLE_CANDIDATE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Register the user
      await api.post('/auth/register', { name, email, password, role });
      
      // 2. Automatically log them in after registration
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      
      login(userData.token, { id: userData.id, email: userData.email, role: userData.role });

      if (userData.role === 'ROLE_RECRUITER') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create an Account</h2>
        <p className="subtitle">Join HireHub today</p>

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
            <label>Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Sign Up as {role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}
