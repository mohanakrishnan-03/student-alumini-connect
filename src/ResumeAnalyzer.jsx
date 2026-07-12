import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import './ResumeAnalyzer.css';
import API_BASE_URL from './config';

const ResumeAnalyzer = () => {
  const { isGuest } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [targetCompany, setTargetCompany] = useState('Generic');
  const [customCompany, setCustomCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Backend API URL
  const API_URL = `${API_BASE_URL}/api/analyze-resume`;

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
    formData.append('targetCompany', targetCompany === 'Other' ? customCompany : targetCompany);
    formData.append('targetRole', targetRole);

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
      setError(error.message || 'Failed to analyze resume. Please try again later.');
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
        <h2>AI Resume Analyzer</h2>
        <p>ML-powered analysis of your resume for ATS compatibility and content quality</p>

      </div>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
          <br />
          <small>Please try again. If the problem persists, the server may be temporarily unavailable.</small>
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
        <div className="targeting-and-upload-container" style={{ width: '100%' }}>
          {/* Target Company & Role Selection UI */}
          <div className="targeting-card" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: 'left',
            backdropFilter: 'blur(10px)'
          }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span> Customize Target Company & Role
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>Target Company</label>
                <select 
                  value={targetCompany} 
                  onChange={(e) => setTargetCompany(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Generic">Generic / General ATS</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Meta">Meta</option>
                  <option value="TCS / Infosys">TCS / Infosys (Service)</option>
                  <option value="Tech Startup">Tech Startup</option>
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>

              {targetCompany === 'Other' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Netflix" 
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: '#1e293b',
                      color: '#f8fafc',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>Target Role / Tech Stack</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

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
                  <p>ML model is analyzing your resume...</p>
                  <p>Extracting features, checking structure, and evaluating content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="analysis-results">
          <div className="results-header">
            <h3>AI Analysis Complete</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <small style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>File: {analysis.file_processed}</small>
              <button 
                onClick={() => setAnalysis(null)} 
                className="analyze-another-btn"
                style={{ whiteSpace: 'nowrap' }}
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