// Stories.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const AlumniStories = () => {
  const navigate = useNavigate();
  const { isAlumni } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  // Back to Home function - uses navigate instead of window.location
  const handleBackToHome = () => {
    navigate('/home');
  };

  // Mock data with Tamil Nadu based alumni and small companies - NO IMAGES
  useEffect(() => {
    const mockStories = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        graduationYear: 2016,
        degree: 'B.Com',
        currentPosition: 'Accountant at Chennai Traders',
        story: 'After completing my B.Com, I started working at Chennai Traders as a junior accountant. With hard work and dedication, I quickly moved up to handle all financial operations for the company. My education gave me the strong foundation needed to manage business accounts effectively. Today, I handle accounts for over 50 local businesses in Chennai.',
        achievement: 'Managed accounts for 50+ local businesses in Chennai'
      },
      {
        id: 2,
        name: 'Priya Lakshmi',
        graduationYear: 2019,
        degree: 'B.Sc Computer Science',
        currentPosition: 'Software Developer at Madurai Tech Solutions',
        story: 'I joined Madurai Tech Solutions right after graduation. Starting as a trainee, I now lead a small team developing software for local businesses. The practical knowledge from my college projects helped me understand real-world software requirements. Recently, I developed an inventory management system that is now used by 30+ local shops across Madurai.',
        achievement: 'Developed inventory management system used by 30+ local shops'
      },
      {
        id: 3,
        name: 'Arun Prabhakaran',
        graduationYear: 2014,
        degree: 'BBA',
        currentPosition: 'Manager at Coimbatore Textiles',
        story: 'My BBA degree helped me understand business operations thoroughly. I started in sales and now manage the entire textile showroom. Working with local weavers and customers has been incredibly rewarding. I\'ve been able to increase showroom sales by 75% in just 2 years by implementing better inventory management and customer service practices.',
        achievement: 'Increased showroom sales by 75% in 2 years'
      },
      {
        id: 4,
        name: 'Deepika Venkatesan',
        graduationYear: 2020,
        degree: 'B.Sc Chemistry',
        currentPosition: 'Lab Technician at Salem Pharma Labs',
        story: 'My chemistry background landed me a job at a local pharmaceutical company. I conduct quality tests for medicines and ensure they meet safety standards. The laboratory experience from college was invaluable. I recently implemented new quality control procedures that have improved our testing accuracy by 40%.',
        achievement: 'Implemented new quality control procedures improving accuracy by 40%'
      },
      {
        id: 5,
        name: 'Karthik Subramanian',
        graduationYear: 2017,
        degree: 'Diploma in Mechanical Engineering',
        currentPosition: 'Supervisor at Tiruchi Auto Works',
        story: 'I started as a mechanic and through my diploma, I gained the technical knowledge to become a supervisor. Now I oversee vehicle repairs and maintenance for our automotive workshop. By implementing better workflow processes, I\'ve reduced average repair time by 30% while maintaining quality standards.',
        achievement: 'Reduced workshop repair time by 30% through process optimization'
      }
    ];

    setTimeout(() => {
      setStories(mockStories);
      setLoading(false);
    }, 800);
  }, []);

  const styles = {
    alumniStories: {
      maxWidth: '1200px', margin: '0 auto', padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#0f0f1a', minHeight: '100vh', color: '#f8fafc',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '2rem', paddingBottom: '1rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    backButton: {
      background: 'rgba(255,255,255,0.07)',
      color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '0.6rem 1.2rem', borderRadius: '50px',
      fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
    },
    titleContainer: { display: 'flex', flexDirection: 'column' },
    title: { color: '#fff', fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' },
    subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' },
    storiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.2rem', marginTop: '1rem',
    },
    storyCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '20px', overflow: 'hidden',
      transition: 'all 0.3s ease', cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.09)',
      display: 'flex', flexDirection: 'column',
    },
    storyContent: { padding: '1.4rem', flex: 1 },
    storyHeader: { display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' },
    avatar: {
      width: '52px', height: '52px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: '800', fontSize: '1.3rem', flexShrink: 0,
    },
    storyInfo: { flex: 1 },
    storyName: { fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: '0 0 0.2rem 0', lineHeight: '1.4' },
    graduationInfo: { color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 },
    currentPosition: { color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', fontStyle: 'italic' },
    storyText: {
      color: 'rgba(255,255,255,0.45)', lineHeight: '1.55', fontSize: '0.85rem', marginBottom: '0.9rem',
      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
      overflow: 'hidden', textOverflow: 'ellipsis',
    },
    achievement: {
      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
      padding: '0.75rem', borderRadius: '10px',
      fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)',
      borderLeft: '3px solid #6366f1', marginTop: 'auto',
    },
    storyModal: {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: '1000', padding: '1rem',
    },
    modalContent: {
      background: 'rgba(18,18,32,0.97)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px', maxWidth: '600px', width: '100%',
      maxHeight: '90vh', overflowY: 'auto', position: 'relative',
    },
    closeBtn: {
      position: 'absolute', top: '1rem', right: '1rem',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
      width: '36px', height: '36px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem', transition: 'all 0.2s',
    },
    modalHeader: {
      display: 'flex', alignItems: 'center',
      padding: '2rem 2rem 1rem 2rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    modalAvatar: {
      width: '68px', height: '68px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: '800', fontSize: '1.8rem',
      marginRight: '1.25rem', flexShrink: 0,
    },
    modalHeaderInfo: { flex: '1' },
    modalHeaderName: { fontSize: '1.35rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' },
    modalBody: { padding: '1.5rem 2rem 2rem 2rem' },
    modalStoryTitle: { color: '#fff', marginBottom: '0.9rem', fontSize: '1rem', fontWeight: '700' },
    modalStoryText: { lineHeight: '1.65', color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem', fontSize: '0.9rem' },
    modalAchievement: {
      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
      padding: '1rem', borderRadius: '12px', borderLeft: '3px solid #6366f1',
    },
    achievementTitle: { fontWeight: '700', color: '#a5b4fc', marginBottom: '0.4rem', fontSize: '0.9rem' },
    storiesLoading: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '4rem',
      color: 'rgba(255,255,255,0.35)', backgroundColor: '#0f0f1a', minHeight: '60vh',
    },
    loadingSpinner: {
      border: '3px solid rgba(99,102,241,0.2)',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%', width: '44px', height: '44px',
      animation: 'spin 0.8s linear infinite', marginBottom: '1rem',
    },
    emptyState: {
      textAlign: 'center', padding: '4rem 2rem',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', gridColumn: '1 / -1', marginTop: '2rem',
    },
    emptyIcon: { fontSize: '3.5rem', marginBottom: '1.2rem', display: 'block' },
    emptyTitle: { color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '700' },
    emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  };

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.alumniStories}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backButton}
              onClick={handleBackToHome}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              ← Back to Home
            </button>
            <div style={styles.titleContainer}>
              <h1 style={styles.title}>📖 Alumni Stories</h1>
              <p style={styles.subtitle}>Success stories of our graduates working in local Tamil Nadu companies</p>
            </div>
          </div>
        </div>
        <div style={styles.storiesLoading}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading inspiring stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.alumniStories}>
      {/* Updated Unified Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={handleBackToHome}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            ← Back to Home
          </button>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>📖  Alumni Stories</h1>
            <p style={styles.subtitle}>Inspiring success stories from our graduates</p>
          </div>
        </div>
        {isAlumni() && (
          <button style={{
            background: 'rgba(52, 152, 219, 0.2)',
            color: '#3498db',
            border: '1px solid rgba(52, 152, 219, 0.4)',
            padding: '0.6rem 1.2rem',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}>
            ✍️ Share Your Story
          </button>
        )}
      </div>

      {/* Stories Grid */}
      <div style={styles.storiesGrid}>
        {stories.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📖</div>
            <h3 style={styles.emptyTitle}>No stories available</h3>
            <p style={styles.emptyText}>Check back later for inspiring alumni stories!</p>
          </div>
        ) : (
          stories.map(story => (
            <div 
              key={story.id} 
              style={styles.storyCard}
              onClick={() => setSelectedStory(story)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.storyContent}>
                <div style={styles.storyHeader}>
                  <div style={styles.avatar}>
                    {story.name.charAt(0)}
                  </div>
                  <div style={styles.storyInfo}>
                    <h3 style={styles.storyName}>{story.name}</h3>
                    <p style={styles.graduationInfo}>
                      🎓 Class of {story.graduationYear} • {story.degree}
                    </p>
                  </div>
                </div>
                
                <p style={styles.currentPosition}>{story.currentPosition}</p>
                
                <p style={styles.storyText}>
                  {story.story.substring(0, 150)}...
                </p>
                
                <div style={styles.achievement}>
                  <strong>🏆 Achievement: </strong>{story.achievement}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div 
          style={styles.storyModal}
          onClick={() => setSelectedStory(null)}
        >
          <div 
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={styles.closeBtn}
              onClick={() => setSelectedStory(null)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              }}
            >
              ×
            </button>
            <div style={styles.modalHeader}>
              <div style={styles.modalAvatar}>
                {selectedStory.name.charAt(0)}
              </div>
              <div style={styles.modalHeaderInfo}>
                <h2 style={styles.modalHeaderName}>{selectedStory.name}</h2>
                <p style={styles.graduationInfo}>
                  🎓 Class of {selectedStory.graduationYear} • {selectedStory.degree}
                </p>
                <p style={styles.currentPosition}>{selectedStory.currentPosition}</p>
              </div>
            </div>
            <div style={styles.modalBody}>
              <h3 style={styles.modalStoryTitle}>My Career Journey</h3>
              <p style={styles.modalStoryText}>{selectedStory.story}</p>
              
              <div style={styles.modalAchievement}>
                <div style={styles.achievementTitle}>Notable Achievement</div>
                {selectedStory.achievement}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniStories;