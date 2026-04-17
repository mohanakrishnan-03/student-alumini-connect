import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { loginGuest } = useAuth();
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleLogin = () => {
    if (selectedType === 'student') {
      navigate('/login/student');
    } else if (selectedType === 'alumni') {
      navigate('/login/alumni');
    }
  };

  const handleSignUp = () => {
    if (selectedType === 'student') {
      navigate('/register/student');
    } else if (selectedType === 'alumni') {
      navigate('/register/alumni');
    }
  };

  const handleGuestExplore = () => {
    loginGuest();
    navigate('/home');
  };

  // If no type selected, show type selection
  if (!selectedType) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="header-container">
            <h1 className="brand-logo">AlumniConnect</h1>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Connect, Learn, Grow Together</h1>
              <p className="hero-subtitle">Bridge between students and alumni for better career opportunities</p>
              
              <div className="type-selection">
                <h3 className="type-heading">Select Your Role</h3>
                <div className="type-grid">
                  <div 
                    className="type-card"
                    onClick={() => handleTypeSelect('student')}
                  >
                    <div className="type-icon">ST</div>
                    <div className="type-name">Student</div>
                    <div className="type-description">Looking for guidance and career opportunities from experienced alumni</div>
                  </div>
                  
                  <div 
                    className="type-card"
                    onClick={() => handleTypeSelect('alumni')}
                  >
                    <div className="type-icon">AL</div>
                    <div className="type-name">Alumni</div>
                    <div className="type-description">Share your experience and mentor the next generation of professionals</div>
                  </div>
                  
                  <div 
                    className="type-card"
                    onClick={handleGuestExplore}
                  >
                    <div className="type-icon">GT</div>
                    <div className="type-name">Guest</div>
                    <div className="type-description">Explore the platform and discover opportunities without creating an account</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section">
            <h2 className="section-title">Our Platform Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3 className="feature-title">AI Resume Analyzer</h3>
                <p className="feature-description">Get instant, intelligent feedback on your resume to improve your job application success rate</p>
              </div>
              <div className="feature-card">
                <h3 className="feature-title">Professional Networking</h3>
                <p className="feature-description">Connect directly with industry experts and experienced alumni for mentorship</p>
              </div>
              <div className="feature-card">
                <h3 className="feature-title">Community Engagement</h3>
                <p className="feature-description">Join meaningful discussions and share experiences with peers and mentors</p>
              </div>
              <div className="feature-card">
                <h3 className="feature-title">Career Events</h3>
                <p className="feature-description">Stay updated with workshops, webinars, and networking events</p>
              </div>
              <div className="feature-card">
                <h3 className="feature-title">Job Opportunities</h3>
                <p className="feature-description">Discover exclusive internship and job openings from partner companies</p>
              </div>
              <div className="feature-card">
                <h3 className="feature-title">Success Stories</h3>
                <p className="feature-description">Get inspired by career journeys and success stories from our alumni network</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <p className="footer-text">&copy; 2024 AlumniConnect. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // If type is selected, show login/signup options
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-container">
          <h1 className="brand-logo">AlumniConnect</h1>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <button className="navigation-back" onClick={handleBack}>
              ← Back to Selection
            </button>
            
            <div className="welcome-section">
              <div className="welcome-icon">
                {selectedType === 'student' ? 'ST' : 'AL'}
              </div>
              <h1 className="welcome-title">
                Welcome {selectedType === 'student' ? 'Student' : 'Alumni'}
              </h1>
              <p className="welcome-description">
                {selectedType === 'student' 
                  ? 'Access career guidance, networking opportunities, and exclusive resources tailored for students' 
                  : 'Share your expertise, mentor students, and stay connected with your alma mater community'
                }
              </p>
            </div>

            <div className="auth-options">
              <div className="auth-card">
                <h3 className="auth-card-title">Existing Account</h3>
                <p className="auth-card-description">
                  Sign in to access your personalized dashboard and continue your journey
                </p>
                <button className="auth-button login-button" onClick={handleLogin}>
                  Sign In
                </button>
              </div>

              <div className="auth-card">
                <h3 className="auth-card-title">New to AlumniConnect</h3>
                <p className="auth-card-description">
                  Create your account to unlock all features and start connecting today
                </p>
                <button className="auth-button signup-button" onClick={handleSignUp}>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;