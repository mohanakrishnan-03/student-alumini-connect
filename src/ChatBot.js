import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const SUGGESTIONS = [
  "How do I improve my resume?",
  "Tips for interview preparation",
  "How to negotiate salary?",
  "Best skills for tech jobs",
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat`;

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGoBack = () => window.history.back();

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const sendMessage = async (text) => {
    const msgText = (text || inputText).trim();
    if (!msgText || isLoading) return;

    addMessage(msgText, 'user');
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      history.push({ role: 'user', content: msgText });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');

      const cleanReply = (data.reply || "Sorry, I couldn't process that.").replace(/[*_#`]/g, '');
      addMessage(cleanReply, 'bot');
    } catch (error) {
      addMessage('Connection error. Make sure the backend is running on port 5000.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="chatbot-container">
      {/* Animated background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Back Button */}
      <button className="back-btn" onClick={handleGoBack}>
        <span>←</span> Back
      </button>

      <div className="chat-wrapper">
        {/* Header */}
        <header className="chat-header">
          <div className="header-avatar">
            <span>🤖</span>
            <div className="online-dot" />
          </div>
          <div className="header-info">
            <h3>AI Career Assistant</h3>
            <p>Powered by Groq · Always online</p>
          </div>
          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </header>

        {/* Messages */}
        <div ref={chatBoxRef} className="chat-box">
          {messages.length === 0 && (
            <div className="welcome-screen">
              <div className="welcome-icon-wrap">
                <span className="welcome-emoji">🤖</span>
                <div className="pulse-ring" />
              </div>
              <h4>Hi! I'm your AI Career Assistant</h4>
              <p>Ask me anything about careers, resumes, or interviews.</p>

              <div className="suggestion-chips">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chip"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.sender}`}>
              {message.sender === 'bot' && (
                <div className="msg-avatar bot-avatar">🤖</div>
              )}
              <div className="message-bubble-wrap">
                <div className={`message-bubble ${message.sender}`}>
                  {message.text}
                </div>
                <span className="msg-time">{message.time}</span>
              </div>
              {message.sender === 'user' && (
                <div className="msg-avatar user-avatar">👤</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-row bot">
              <div className="msg-avatar bot-avatar">🤖</div>
              <div className="typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask about careers, resumes, interviews..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <div className="send-spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <p className="input-hint">Press Enter to send · Powered by Llama 3.3 via Groq</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
