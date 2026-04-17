import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './Community.css';

const Community = () => {
  const navigate = useNavigate();
  const { token, getAllUsers, isAlumni, isGuest } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOpportunityFile, setSelectedOpportunityFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const opportunityFileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all registered users for the sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      if (res.success) {
        setActiveUsers(res.users);
      }
    };
    if (token) {
      fetchUsers();
    }
  }, [token, getAllUsers]);

  // Fetch community posts
  const fetchPosts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/community`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(data.posts);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    }
  };

  // Poll for real-time updates
  useEffect(() => {
    fetchPosts();
    
    // Clear existing interval
    if (pollInterval.current) clearInterval(pollInterval.current);
    
    // Start polling every 3 seconds
    pollInterval.current = setInterval(() => {
      fetchPosts();
    }, 3000);
    
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [token]);

  const sendPostToBackend = async (postData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(prev => [...prev, data.post]);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending post:', error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !selectedFile) return;

    let postData = { content: newMessage };

    if (selectedFile && newMessage.trim()) {
      postData = {
        content: newMessage,
        type: 'file-text',
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB'
      };
    } else if (selectedFile) {
      postData = {
        content: `Shared a file: ${selectedFile.name}`,
        type: 'file',
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB'
      };
    } else {
      postData = {
        content: newMessage,
        type: 'text'
      };
    }

    sendPostToBackend(postData);

    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePostOpportunity = () => {
    if (!selectedOpportunityFile) {
      alert('Please select a file to share as opportunity');
      return;
    }

    const postData = {
      content: `New opportunity shared: ${selectedOpportunityFile.name}`,
      type: 'opportunity',
      fileName: selectedOpportunityFile.name,
      fileSize: (selectedOpportunityFile.size / 1024).toFixed(2) + ' KB'
    };

    sendPostToBackend(postData);

    setSelectedOpportunityFile(null);
    if (opportunityFileInputRef.current) opportunityFileInputRef.current.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleOpportunityFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedOpportunityFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeOpportunityFile = () => {
    setSelectedOpportunityFile(null);
    if (opportunityFileInputRef.current) opportunityFileInputRef.current.value = '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'away': return '#F59E0B';
      case 'offline': return '#9CA3AF';
      default: return '#10B981';
    }
  };

  const downloadFile = (fileName) => {
    alert(`Downloading ${fileName} - This would download the file in a real application`);
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>🎓 Alumni-Student Community</h1>
          <p>Connect, learn, and grow together</p>
        </div>
      </div>

      <div className="community-container">
        <div className="community-layout">
          {/* Sidebar - Active Users */}
          <div className="sidebar">
            <div className="sidebar-header">
              <h3>Community Members</h3>
              <span className="online-count">
                <span className="online-dot"></span>
                {activeUsers.length} members
              </span>
            </div>
            
            <div className="users-list">
              {activeUsers.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-avatar-status">
                    <span className="user-avatar">{user.name.charAt(0)}</span>
                    <div 
                      className="status-indicator" 
                      style={{ backgroundColor: getStatusColor(user.status) }}
                      title={user.status}
                    ></div>
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions - Post Opportunity (ALUMNI ONLY) */}
            {isAlumni() && (
              <div className="quick-actions">
                <h4>🎯 Share Opportunity</h4>
                <p className="action-description">Share job/internship opportunities with the community</p>
                <input
                  type="file"
                  ref={opportunityFileInputRef}
                  onChange={handleOpportunityFileSelect}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                
                {!selectedOpportunityFile ? (
                  <button 
                    className="action-btn opportunity-btn"
                    onClick={() => opportunityFileInputRef.current?.click()}
                  >
                    📋 Upload Opportunity File
                  </button>
                ) : (
                  <div className="opportunity-preview">
                    <div className="file-info">
                      <div className="file-icon">📋</div>
                      <div className="file-details">
                        <div className="file-name">{selectedOpportunityFile.name}</div>
                        <div className="file-size">{(selectedOpportunityFile.size / 1024).toFixed(2)} KB</div>
                      </div>
                    </div>
                    <div className="opportunity-actions">
                      <button 
                        className="post-opportunity-btn"
                        onClick={handlePostOpportunity}
                      >
                        📤 Post Opportunity
                      </button>
                      <button 
                        className="remove-file-btn"
                        onClick={removeOpportunityFile}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="chat-area">
            <div className="chat-header">
              <div className="chat-info">
                <h3>Community Chat</h3>
                <span className="chat-description">Career guidance, opportunities, and networking</span>
              </div>
              <div className="chat-stats">
                <span className="stats-item">💬 {messages.length} messages</span>
                <span className="stats-item">👥 {activeUsers.length} members</span>
              </div>
            </div>

            <div className="messages-container">
              <div className="welcome-message">
                <div className="welcome-icon">🎉</div>
                <div className="welcome-content">
                  <h4>Welcome to Alumni-Student Community!</h4>
                  <p>Connect with alumni, share opportunities, and get career guidance</p>
                </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === 'current' ? 'message-sent' : 'message-received'}`}
                >
                  <div className="message-avatar">
                    {msg.avatar}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <div className="sender-info">
                        <span className="sender-name">{msg.name}</span>
                        <span className="sender-role">{msg.role}</span>
                      </div>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    
                    {msg.type === 'text' && (
                      <div className="message-text">
                        {msg.message}
                      </div>
                    )}

                    {(msg.type === 'file' || msg.type === 'file-text') && (
                      <div className="message-with-file">
                        {msg.type === 'file-text' && (
                          <div className="message-text">
                            {msg.message}
                          </div>
                        )}
                        <div 
                          className="file-attachment" 
                          onClick={() => downloadFile(msg.fileName)}
                        >
                          <div className="file-icon">📎</div>
                          <div className="file-info">
                            <div className="file-name">{msg.fileName}</div>
                            <div className="file-size">{msg.fileSize}</div>
                          </div>
                          <button className="download-btn" title="Download">⬇️</button>
                        </div>
                      </div>
                    )}

                    {msg.type === 'opportunity' && (
                      <div className="opportunity-message">
                        <div className="opportunity-badge">🎯 OPPORTUNITY</div>
                        <div className="message-text">
                          {msg.message}
                        </div>
                        <div 
                          className="opportunity-attachment" 
                          onClick={() => downloadFile(msg.fileName)}
                        >
                          <div className="file-icon">📋</div>
                          <div className="file-info">
                            <div className="file-name">{msg.fileName}</div>
                            <div className="file-size">{msg.fileSize}</div>
                            <div className="opportunity-note">Click to download opportunity details</div>
                          </div>
                          <button className="download-btn" title="Download">⬇️</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* File Preview for regular messages */}
            {selectedFile && (
              <div className="file-preview-container">
                <div className="file-preview">
                  <div className="file-info">
                    <div className="file-icon">📎</div>
                    <div className="file-details">
                      <div className="file-name">{selectedFile.name}</div>
                      <div className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>
                  <button className="remove-file-btn" onClick={removeFile} title="Remove">
                    ✕
                  </button>
                </div>
              </div>
            )}

            {isGuest() ? (
              <div className="guest-banner" style={{
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderTop: '1px solid rgba(52, 152, 219, 0.2)',
                color: '#3498db',
                fontWeight: '500'
              }}>
                <p>🔒 Please <a href="/" style={{color: '#3498db', textDecoration: 'underline'}}>log in</a> or sign up to participate in the community.</p>
              </div>
            ) : (
              <div className="message-input-container">
                <div className="input-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <button 
                    className="input-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                  >
                    📎
                  </button>
                  <button 
                    className="input-action-btn"
                    title="Add emoji"
                  >
                    😊
                  </button>
                </div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  className="message-input"
                  rows="1"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedFile}
                  className="send-button"
                  title="Send message"
                >
                  📤
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;