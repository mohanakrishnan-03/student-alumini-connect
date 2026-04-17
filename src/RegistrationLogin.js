import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './RegistrationLogin.css';

const RegistrationLogin = ({ userType }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    collegeId: '',
    yearOfStudy: '',
    branch: '',
    graduationYear: '',
    company: '',
    position: ''
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
      const userData = {
        ...formData,
        userType: userType
      };
      
      const result = await register(userData);
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

  const handleLoginRedirect = () => {
    if (userType === 'student') {
      navigate('/login/student');
    } else {
      navigate('/login/alumni');
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h2>Create {userType === 'student' ? 'Student' : 'Alumni'} Account</h2>
          <p>Join our community and start your journey</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>College ID</label>
              <input
                type="text"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your college ID"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email address"
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
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {userType === 'student' && (
            <div className="form-row">
              <div className="form-group">
                <label>Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">First Year</option>
                  <option value="2nd Year">Second Year</option>
                  <option value="3rd Year">Third Year</option>
                  <option value="4th Year">Fourth Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>Branch/Department</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Alumni Specific Fields */}
          {userType === 'alumni' && (
            <div className="form-row">
              <div className="form-group">
                <label>Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  min="2000"
                  max="2024"
                  required
                  disabled={loading}
                  placeholder="Year of graduation"
                />
              </div>

              <div className="form-group">
                <label>Current Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Current company/organization"
                />
              </div>

              <div className="form-group">
                <label>Position/Role</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Your current position"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-redirect">
          <p>Already have an account? <span onClick={handleLoginRedirect}>Sign in here</span></p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationLogin;