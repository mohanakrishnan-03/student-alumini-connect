import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const { isGuest } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  // Backend API URL
  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/analyze-resume`;

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      console.log('Sending request to backend...');
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }
      
      console.log('Analysis result:', result);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.message || 'Failed to analyze resume. Please check if the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const result = await response.json();
      alert(`Backend connection: ${result.status}\n${result.message}`);
    } catch (error) {
      alert('Backend connection failed. Make sure the Node.js server is running on port 5000.');
    }
  };

  // Back button functionality
  const handleGoBack = () => {
    window.history.back(); // Go back to previous page
    // Or use: window.location.href = '/'; // Go to home page
  };

  return (
    <div className="resume-analyzer">
      {/* BACK BUTTON ADDED HERE */}
      <button 
        onClick={handleGoBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: '100',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}
      >
        <span style={{ fontSize: '18px' }}>←</span>
        Back To Home
      </button>
      
      <div className="analyzer-header">
        <h2>🤖 AI Resume Analyzer</h2>
        <p>ML-powered analysis of your resume for ATS compatibility and content quality</p>
        <button 
          onClick={testBackendConnection}
          className="test-connection-btn"
        >
          Test Backend Connection
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
          <br />
          <small>Make sure the Node.js backend is running on port 5000</small>
        </div>
      )}
      
      {isGuest() ? (
        <div className="guest-banner" style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          border: '1px solid rgba(52, 152, 219, 0.3)',
          borderRadius: '12px',
          color: '#3498db',
          fontWeight: '500',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>🔒 Sign In Required</h3>
          <p>Please <a href="/" style={{color: '#3498db', textDecoration: 'underline'}}>log in</a> or sign up as a Student to use the AI Resume Analyzer.</p>
        </div>
      ) : !analysis ? (
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            <div className="upload-icon">📄</div>
            <h3>Upload Your Resume</h3>
            <p>Drag & drop your resume here or click to browse</p>
            <p className="file-types">Supported formats: PDF, DOC, DOCX</p>
            <button 
              className="upload-btn"
              onClick={() => document.getElementById('resume-upload').click()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  AI Analyzing...
                </>
              ) : (
                'Choose File'
              )}
            </button>
            {loading && (
              <div className="analyzing-text">
                <p>🤖 ML model is analyzing your resume...</p>
                <p>Extracting features, checking structure, and evaluating content</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="analysis-results">
          <div className="results-header">
            <h3>🤖 AI Analysis Complete</h3>
            <div>
              <small>File: {analysis.file_processed}</small>
              <button 
                onClick={() => setAnalysis(null)} 
                className="analyze-another-btn"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>

          {/* Overall Score */}
          <div className="score-section">
            <div className="overall-score">
              <div 
                className="score-circle"
                style={{ 
                  background: `conic-gradient(${getScoreColor(analysis.overall_score)} ${analysis.overall_score * 3.6}deg, #e5e7eb 0deg)` 
                }}
              >
                <span className="score-value">{analysis.overall_score}</span>
                <span className="score-total">/100</span>
              </div>
              <div className="score-label">AI Overall Score</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="breakdown-section">
            <h4>ML Feature Analysis</h4>
            <div className="breakdown-grid">
              {Object.entries(analysis.breakdown).map(([key, data]) => (
                <div key={key} className="breakdown-item">
                  <div className="category-header">
                    <span className="category-name">{data.label}</span>
                    <span 
                      className="category-score"
                      style={{ color: getScoreColor(data.score) }}
                    >
                      {data.score}/100
                    </span>
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${data.score}%`,
                        backgroundColor: getScoreColor(data.score)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="feedback-section">
            <div className="feedback-grid">
              <div className="feedback-card strengths">
                <div className="feedback-header">
                  <span className="feedback-icon">✅</span>
                  <h5>ML Detected Strengths</h5>
                </div>
                <ul>
                  {analysis.feedback.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="feedback-card improvements">
                <div className="feedback-header">
                  <span className="feedback-icon">⚠️</span>
                  <h5>AI Recommendations</h5>
                </div>
                <ul>
                  {analysis.feedback.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-card suggestions">
                <div className="feedback-header">
                  <span className="feedback-icon">💡</span>
                  <h5>Smart Suggestions</h5>
                </div>
                <ul>
                  {analysis.feedback.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Extracted Text Preview */}
          {analysis.extracted_text_preview && (
            <div className="text-preview">
              <h4>📝 Extracted Text Preview</h4>
              <div className="preview-content">
                {analysis.extracted_text_preview}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;