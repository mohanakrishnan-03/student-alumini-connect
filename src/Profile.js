// src/Profile.js - Complete file with no scrolling and matching back button
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, fetchUserProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Load fresh data when component mounts
    if (user?.id) {
      refreshProfile();
    }
  }, [user?.id]);

  const refreshProfile = async () => {
    setLoading(true);
    setError('');
    try {
      if (user?.id) {
        const result = await fetchUserProfile(user.id);
        if (!result.success) {
          setError(result.error || 'Failed to load profile');
        }
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditForm({});
      setError('');
    } else {
      setIsEditing(true);
      setEditForm({
        fullName: user?.fullName || '',
        yearOfStudy: user?.yearOfStudy || '',
        branch: user?.branch || '',
        graduationYear: user?.graduationYear || '',
        company: user?.company || '',
        position: user?.position || ''
      });
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await updateProfile(editForm);
      
      if (result.success) {
        setIsEditing(false);
        setEditForm({});
        alert('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently joined';
    }
  };

  if (authLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Please Login</h2>
          <p>You need to login to view your profile</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/home')} className="back-button">
          <span>←</span>
          Back to Home
        </button>
        <h1>👤 Profile</h1>
      </header>
      
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}
      
      <div className="page-content">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-header-info">
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                  className="edit-input"
                  placeholder="Full Name"
                  disabled={loading}
                />
              ) : (
                <h2>{user.fullName || 'User'}</h2>
              )}
              <p className="user-role">
                {user.userType ? 
                  user.userType.charAt(0).toUpperCase() + user.userType.slice(1) 
                  : 'Guest'
                }
              </p>
              <p className="user-email">{user.email || 'No email provided'}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="details-header">
              <h3>Personal Information</h3>
              {!isEditing && (
                <button onClick={handleEditToggle} className="edit-button" disabled={loading}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label>College ID</label>
                <p className="detail-value">{user.collegeId || 'Not provided'}</p>
              </div>
              
              {/* Student Specific Details */}
              {user.userType === 'student' && (
                <>
                  <div className="detail-item">
                    <label>Year of Study</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="yearOfStudy"
                        value={editForm.yearOfStudy}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="e.g., 3rd Year"
                        disabled={loading}
                      />
                    ) : (
                      <p className="detail-value">{user.yearOfStudy || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="detail-item">
                    <label>Branch</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="branch"
                        value={editForm.branch}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="e.g., Computer Science"
                        disabled={loading}
                      />
                    ) : (
                      <p className="detail-value">{user.branch || 'Not provided'}</p>
                    )}
                  </div>
                </>
              )}

              {/* Alumni Specific Details */}
              {user.userType === 'alumni' && (
                <>
                  <div className="detail-item">
                    <label>Graduation Year</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="graduationYear"
                        value={editForm.graduationYear}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="e.g., 2020"
                        min="1900"
                        max={new Date().getFullYear()}
                        disabled={loading}
                      />
                    ) : (
                      <p className="detail-value">{user.graduationYear || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="detail-item">
                    <label>Current Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={editForm.company}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="e.g., Google"
                        disabled={loading}
                      />
                    ) : (
                      <p className="detail-value">{user.company || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="detail-item">
                    <label>Position</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={editForm.position}
                        onChange={handleEditChange}
                        className="edit-input"
                        placeholder="e.g., Software Engineer"
                        disabled={loading}
                      />
                    ) : (
                      <p className="detail-value">{user.position || 'Not provided'}</p>
                    )}
                  </div>
                </>
              )}

              <div className="detail-item">
                <label>Member Since</label>
                <p className="detail-value">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Edit Mode Actions */}
            {isEditing && (
              <div className="edit-actions">
                <button 
                  onClick={handleSaveProfile} 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
                <button 
                  onClick={handleEditToggle} 
                  className="cancel-button"
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button 
              className="refresh-btn"
              onClick={refreshProfile}
              disabled={loading}
            >
              🔄 Refresh Profile
            </button>
            <button 
              className="change-password-btn"
              onClick={() => alert('Password change feature coming soon!')}
              disabled={loading}
            >
              🔐 Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;