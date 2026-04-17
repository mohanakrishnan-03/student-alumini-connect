import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './HomePage.css';

const HomePage = ({ isGuest = false }) => {
  const navigate = useNavigate();
  const { user, logout, isStudent, isAlumni } = useAuth();
  const cardsRef = useRef([]);

  // Dynamic feature cards based on user role
  const getFeatureCards = () => {
    const baseCards = [
      {
        id: 'ai-bot',
        title: 'AI Assistant',
        subtitle: 'Career Q&A',
        icon: '🤖',
        description: 'Ask anything about jobs, interviews, or career growth. Instant answers 24/7.',
        path: '/chatbot',
        accent: 'accent-violet',
        size: 'small',
        tag: 'New',
      },
      {
        id: 'community',
        title: 'Community',
        subtitle: 'Connect & Discuss',
        icon: '👥',
        description: 'Join forums, share experiences, and network with alumni and peers.',
        path: '/community',
        accent: 'accent-rose',
        size: 'small',
        tag: '',
      },
      {
        id: 'chat',
        title: 'Live Chat',
        subtitle: 'Real-time Messaging',
        icon: '💬',
        description: 'Chat directly with alumni and fellow students. Build your mentorship network.',
        path: '/chat',
        accent: 'accent-cyan',
        size: 'wide',
        tag: '',
      },
    ];

    if (isStudent()) {
      return [
        {
          id: 'resume',
          title: 'Resume Analyzer',
          subtitle: 'AI-Powered Feedback',
          icon: '📄',
          description: 'Upload your resume and get instant AI analysis — ATS score, strengths, and personalized improvement tips.',
          path: '/resume',
          accent: 'accent-indigo',
          size: 'large',
          tag: 'Most Popular',
        },
        ...baseCards
      ];
    } else {
      // Alumni specific cards
      return [
        {
          id: 'jobs-portal',
          title: 'Share Opportunities',
          subtitle: 'Recruit Talent',
          icon: '💼',
          description: 'Post job openings and internships to help the next generation of graduates.',
          path: '/jobs',
          accent: 'accent-indigo',
          size: 'large',
          tag: 'Hiring',
        },
        ...baseCards
      ];
    }
  };

  const featureCards = getFeatureCards();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="home-container">
      {/* Animated background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* ── Header ── */}
      <header className="home-header">
        <div className="header-inner">
          <div className="logo">🎓 AlumniConnect</div>

          <nav className="header-nav">
            <button onClick={() => navigate('/events')} className="nav-link">Events</button>
            <button onClick={() => navigate('/stories')} className="nav-link">Stories</button>
            <button onClick={() => navigate('/jobs')} className="nav-link">Jobs</button>
          </nav>

          <div className="user-section">
            <button className="profile-btn" onClick={() => navigate('/profile')}>
              <span className="header-avatar">👤</span>
              <span className="profile-name">{user?.fullName?.split(' ')[0] || 'Profile'}</span>
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-badge">✦ Welcome back, {isAlumni() ? 'Alumni' : 'Student'} {user?.fullName?.split(' ')[0]}!</div>
          <h1 className="hero-title">
            Your Career<br />
            <span className="hero-gradient-text">Dashboard</span>
          </h1>
          <p className="hero-sub">Everything you need to grow your career — in one place.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-pill">📄 Resume Analysis</div>
          <div className="stat-pill">🤖 AI Guidance</div>
          <div className="stat-pill">👥 Community</div>
          <div className="stat-pill">💬 Live Chat</div>
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section className="bento-section">
        <div className="bento-grid">
          {featureCards.map((card, i) => (
            <div
              key={card.id}
              className={`bento-card ${card.accent} ${card.size}`}
              ref={el => cardsRef.current[i] = el}
              onClick={() => navigate(card.path)}
            >
              {card.tag && <span className="card-tag">{card.tag}</span>}

              <div className="card-icon-wrap">
                <span className="card-icon">{card.icon}</span>
              </div>

              <div className="card-body">
                <p className="card-subtitle">{card.subtitle}</p>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
              </div>

              <div className="card-footer">
                <span className="card-cta">
                  Open
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>

              <div className="card-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <p className="footer-brand">🎓 AlumniConnect</p>
          <p className="footer-text">Bridging students and alumni for better careers.</p>
          <p className="footer-copy">© 2026 AlumniConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;