import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const { token, getAllUsers, user, isGuest } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.users);
        if (res.users.length > 0) {
          setActiveUser(res.users[0]);
        }
      }
      setLoadingUsers(false);
    };
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Fetch messages for active user
  const fetchMessages = async (userId) => {
    if (!token || !userId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/chat/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setConversations(prev => ({
          ...prev,
          [userId]: data.messages
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Poll for messages when activeUser changes
  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
      
      // Clear existing interval
      if (pollInterval.current) clearInterval(pollInterval.current);
      
      // Start polling every 3 seconds for real-time feel
      pollInterval.current = setInterval(() => {
        fetchMessages(activeUser.id);
      }, 3000);
    }
    
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [activeUser, token]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeUser]);

  const sendMessage = async () => {
    if (input.trim() === "" || !activeUser) return;
    const textToSend = input;
    setInput(""); // Clear input immediately for better UX

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeUser.id,
          text: textToSend
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Optimistically append to local state
        setConversations(prev => ({
          ...prev,
          [activeUser.id]: [...(prev[activeUser.id] || []), data.message]
        }));
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Could restore input here on failure
    }
  };

  const handleFileUpload = (event) => {
    // Mock file upload just sends a text message indicating file
    const file = event.target.files[0];
    if (!file || !activeUser) return;

    let content;
    if (file.type.startsWith("image/")) {
      content = `📷 Image: ${file.name}`;
    } else if (file.type.includes("pdf")) {
      content = `📄 PDF: ${file.name}`;
    } else {
      content = `📎 File: ${file.name}`;
    }

    // Send it like a normal message
    setInput(content);
    setTimeout(() => {
      document.querySelector('.send-btn').click();
    }, 100);
    
    event.target.value = "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getLastMessage = (userId) => {
    const userMessages = conversations[userId];
    return userMessages && userMessages.length > 0 
      ? userMessages[userMessages.length - 1].text 
      : "No messages yet";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#10B981';
      case 'away': return '#F59E0B';
      case 'offline': return '#9CA3AF';
      default: return '#10B981';
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        <h1>💬 Alumni Chat</h1>
      </div>

      <div className="chat-container">
        <div className="chat-list">
          <div className="chat-list-header">
            <h3>Conversations</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          
          <div className="users-list">
            {loadingUsers ? (
              <div style={{ padding: '20px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Loading contacts...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '20px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>No other users found</div>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className={`user-item ${activeUser?.id === u.id ? "active" : ""}`}
                  onClick={() => setActiveUser(u)}
                >
                  <div className="user-avatar">
                    {u.name.charAt(0)}
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: getStatusColor(u.status) }}
                    ></span>
                  </div>
                  <div className="user-info">
                    <div className="user-name-row">
                      <span className="user-name">{u.name}</span>
                      <span className="last-time">
                        {conversations[u.id] && conversations[u.id].length > 0
                          ? conversations[u.id][conversations[u.id].length - 1].timestamp
                          : ""
                        }
                      </span>
                    </div>
                    <div className="user-role">{u.role}</div>
                    <div className="last-message">{getLastMessage(u.id)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        {activeUser ? (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="chat-header-left">
                <div className="chat-avatar">{activeUser.name.charAt(0)}</div>
                <div>
                  <div className="chat-user-name">{activeUser.name}</div>
                  <div className="chat-user-role">
                    <span className="status-indicator" style={{ backgroundColor: getStatusColor(activeUser.status) }}></span>
                    {activeUser.role} • {activeUser.status}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn" title="Video call">📹</button>
                <button className="action-btn" title="Voice call">📞</button>
                <button className="action-btn" title="More options">⋯</button>
              </div>
            </div>

            <div className="chat-window-messages">
              <div className="date-separator">
                <span>Today</span>
              </div>
              
              {conversations[activeUser.id]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender}`}
                >
                  <div className="message-bubble">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-meta">
                      <span className="message-time">{msg.timestamp}</span>
                      {msg.sender === "sent" && <span className="message-status">✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-window-input">
              <div className="input-tools">
                <label 
                  htmlFor="fileInput" 
                  className="tool-btn"
                  title="Attach file"
                >
                  📎
                </label>
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  style={{ display: "none" }}
                />
                <button className="tool-btn" title="Emoji">😊</button>
                <button className="tool-btn" title="Voice message">🎤</button>
              </div>
              
              <input
                type="text"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              
              <button 
                onClick={sendMessage} 
                className="send-btn"
                disabled={!input.trim()}
              >
                <span className="send-icon">➤</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h2>Select a conversation</h2>
              <p>Choose a contact from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;