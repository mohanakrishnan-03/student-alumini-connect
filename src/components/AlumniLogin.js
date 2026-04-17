import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { loginAlumni } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginAlumni(formData.email, formData.password);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/register/alumni');
  };

  const handleStudentLoginRedirect = () => {
    navigate('/login/student');
  };

  const handleGuestRedirect = () => {
    navigate('/guest');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Alumni Login</h2>
          <p>Welcome back! Access your alumni dashboard</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your alumni email"
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              placeholder="Enter your password"
              className="login-input"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn alumni-btn"
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="loading-spinner"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In as Alumni'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="footer-buttons">
            <button className="footer-btn create-btn" onClick={handleSignUpRedirect}>
              Create Alumni Account
            </button>
            <button className="footer-btn switch-btn" onClick={handleStudentLoginRedirect}>
              Switch to Student Login
            </button>
            <button className="footer-btn guest-btn" onClick={handleGuestRedirect}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniLogin;