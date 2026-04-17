// JobOffersPortal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const JobOffersPortal = () => {
  const navigate = useNavigate();
  const { isAlumni, isStudent } = useAuth();

  const [offers, setOffers] = useState([
    {
      id: 1,
      company: 'Chennai Tech Solutions',
      position: 'Frontend Developer',
      type: 'Full-time',
      salary: '₹4-6 LPA',
      location: 'Chennai',
      experience: '1-3 years',
      description: 'We are looking for a skilled Frontend Developer proficient in React.js and modern JavaScript frameworks.',
      requirements: ['React.js', 'JavaScript', 'HTML/CSS', 'REST APIs'],
      postedBy: 'HR Manager',
      postedDate: '2024-01-15',
      contactEmail: 'hr@chennaitech.com',
      isVerified: true,
      document: 'job-posting-1.pdf'
    },
    {
      id: 2,
      company: 'Madurai Finance Hub',
      position: 'Junior Accountant',
      type: 'Full-time',
      salary: '₹3-4 LPA',
      location: 'Madurai',
      experience: '0-2 years',
      description: 'Commerce graduates needed for accounting operations. Tally knowledge required.',
      requirements: ['Tally', 'MS Excel', 'Accounting'],
      postedBy: 'Finance Head',
      postedDate: '2024-01-12',
      contactEmail: 'careers@maduraifinance.com',
      isVerified: true,
      document: 'accountant-job.pdf'
    },
    {
      id: 3,
      company: 'Coimbatore Manufacturing',
      position: 'Production Supervisor',
      type: 'Full-time',
      salary: '₹5-7 LPA',
      location: 'Coimbatore',
      experience: '3-5 years',
      description: 'Manage production line operations and ensure quality standards in automotive manufacturing.',
      requirements: ['Production Management', 'Quality Control'],
      postedBy: 'Operations Manager',
      postedDate: '2024-01-10',
      contactEmail: 'jobs@coimbatoremfg.com',
      isVerified: true,
      document: 'production-supervisor.pdf'
    },
    {
      id: 4,
      company: 'Salem Healthcare',
      position: 'Staff Nurse',
      type: 'Full-time',
      salary: '₹3-5 LPA',
      location: 'Salem',
      experience: '1-2 years',
      description: 'Registered nurses required for multi-specialty hospital. B.Sc Nursing required.',
      requirements: ['B.Sc Nursing', 'Nursing License', 'Patient Care'],
      postedBy: 'HR Department',
      postedDate: '2024-01-08',
      contactEmail: 'careers@salemhealthcare.com',
      isVerified: true,
      document: 'nurse-job.pdf'
    },
    {
      id: 5,
      company: 'Tiruchi EduTech',
      position: 'Science Teacher',
      type: 'Part-time',
      salary: '₹25-30k per month',
      location: 'Tiruchirappalli',
      experience: '2-4 years',
      description: 'Looking for passionate science teachers for high school students. CBSE curriculum experience preferred.',
      requirements: ['B.Sc/M.Sc', 'Teaching Experience', 'Science Subjects'],
      postedBy: 'Principal',
      postedDate: '2024-01-05',
      contactEmail: 'hr@tiruchiedutech.com',
      isVerified: false,
      document: 'teacher-position.pdf'
    },
    {
      id: 6,
      company: 'Vellore Retail Group',
      position: 'Store Manager',
      type: 'Full-time',
      salary: '₹6-8 LPA',
      location: 'Vellore',
      experience: '4-6 years',
      description: 'Manage daily operations of retail store, including inventory, staff, and customer service.',
      requirements: ['Retail Management', 'Inventory Control', 'Team Management'],
      postedBy: 'Operations Head',
      postedDate: '2024-01-03',
      contactEmail: 'jobs@velloreretail.com',
      isVerified: true,
      document: 'store-manager.pdf'
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitOffer = async () => {
    if (!uploadedFile) {
      alert('Please upload a job posting document');
      return;
    }

    setUploading(true);

    // Simulate file processing and extraction
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, you would:
      // 1. Upload file to server
      // 2. Extract data from the document (PDF/text parsing)
      // 3. Add to offers list
      
      const newOffer = {
        id: offers.length + 1,
        company: 'New Company', // Extracted from document
        position: 'New Position', // Extracted from document
        type: 'Full-time',
        salary: 'To be discussed',
        location: 'Tamil Nadu',
        experience: 'Not specified',
        description: 'Job details extracted from uploaded document.',
        requirements: ['Details in document'],
        postedBy: 'Document Upload',
        postedDate: new Date().toISOString().split('T')[0],
        contactEmail: 'contact@company.com',
        isVerified: false,
        document: uploadedFile.name
      };

      setOffers(prev => [newOffer, ...prev]);
      setUploadedFile(null);
      setShowUploadModal(false);
      alert('Job offer uploaded successfully! It will be visible after processing.');
      
    } catch (error) {
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#0f0f1a',
      minHeight: '100vh',
      color: '#f8fafc',
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
    uploadButton: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', border: 'none',
      padding: '0.65rem 1.4rem', borderRadius: '50px',
      fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif",
      boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
    },
    offersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.2rem', marginTop: '1rem',
    },
    offerCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '20px', padding: '1.4rem',
      border: '1px solid rgba(255,255,255,0.09)',
      transition: 'all 0.3s ease',
    },
    offerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
    companyInfo: { display: 'flex', alignItems: 'center', gap: '0.9rem' },
    companyLogo: {
      width: '46px', height: '46px', borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: '800', fontSize: '1.1rem',
    },
    positionTitle: { fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: '0 0 0.2rem 0', lineHeight: '1.4' },
    companyName: { fontSize: '0.85rem', color: '#a5b4fc', fontWeight: '500', margin: 0 },
    jobMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.9rem' },
    metaTag: {
      background: 'rgba(255,255,255,0.06)', padding: '0.35rem 0.75rem',
      borderRadius: '50px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)',
      border: '1px solid rgba(255,255,255,0.09)',
      display: 'flex', alignItems: 'center', gap: '0.25rem',
    },
    salaryTag: { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' },
    description: { color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', marginBottom: '0.9rem', fontSize: '0.85rem' },
    requirements: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' },
    requirement: {
      background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
      padding: '0.25rem 0.75rem', borderRadius: '50px',
      fontSize: '0.75rem', fontWeight: '600',
      border: '1px solid rgba(99,102,241,0.2)',
    },
    offerFooter: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingTop: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.07)',
    },
    contactInfo: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' },
    documentBadge: {
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.9rem',
      borderRadius: '50px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
      textDecoration: 'none', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer',
    },
    verifiedBadge: {
      background: 'rgba(34,197,94,0.15)', color: '#4ade80',
      border: '1px solid rgba(34,197,94,0.25)',
      padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '600',
    },
    pendingBadge: {
      background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
      border: '1px solid rgba(251,191,36,0.25)',
      padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '600',
    },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem',
    },
    modalContent: {
      background: 'rgba(18,18,32,0.95)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px', padding: '2rem',
      maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
    },
    modalTitle: { fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' },
    uploadArea: {
      border: '2px dashed rgba(99,102,241,0.35)', borderRadius: '14px',
      padding: '2.5rem 2rem', textAlign: 'center',
      background: 'rgba(99,102,241,0.05)', marginBottom: '1.5rem',
      cursor: 'pointer', transition: 'all 0.2s',
    },
    fileInput: { display: 'none' },
    uploadText: { color: '#a5b4fc', fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem' },
    uploadSubtext: { color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' },
    fileInfo: {
      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
      padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center',
    },
    fileName: { fontWeight: '700', color: '#fff', marginBottom: '0.4rem' },
    fileSize: { color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' },
    modalActions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
    actionButton: {
      padding: '0.75rem 2rem', borderRadius: '12px', border: 'none',
      fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer',
      transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
    },
    submitButton: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' },
    cancelButton: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' },
    disabledButton: { background: 'rgba(255,255,255,0.04)', cursor: 'not-allowed', opacity: 0.5 },
    supportedFormats: { textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '1rem' },
    emptyState: {
      textAlign: 'center', padding: '4rem 2rem',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', gridColumn: '1 / -1',
    },
    emptyIcon: { fontSize: '3.5rem', marginBottom: '1.2rem', display: 'block' },
    emptyTitle: { color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '700' },
    emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1.5rem' },
    createFirstBtn: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none',
      padding: '0.75rem 2rem', borderRadius: '50px', cursor: 'pointer',
      fontSize: '0.9rem', fontWeight: '700', transition: 'all 0.2s',
      fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
    }
  };

  return (
    <div style={styles.container}>
      {/* Updated Unified Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.07)'}
          >
            ← Back to Home
          </button>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>💼 Job Offers Portal</h1>
            <p style={styles.subtitle}>Find and share job opportunities across Tamil Nadu</p>
          </div>
        </div>
        {isAlumni() && (
          <button
            style={styles.uploadButton}
            onClick={() => setShowUploadModal(true)}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            📄 Upload Job Offer
          </button>
        )}
      </div>

      {/* Job Offers List */}
      <div style={styles.offersGrid}>
        {offers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💼</div>
            <h3 style={styles.emptyTitle}>No job offers yet</h3>
            <p style={styles.emptyText}>Be the first to share a job opportunity!</p>
            {isAlumni() && (
              <button 
                style={styles.createFirstBtn}
                onClick={() => setShowUploadModal(true)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Share First Job
              </button>
            )}
          </div>
        ) : (
          offers.map(offer => (
            <div
              key={offer.id}
              style={styles.offerCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.offerHeader}>
                <div style={styles.companyInfo}>
                  <div style={styles.companyLogo}>
                    {offer.company.charAt(0)}
                  </div>
                  <div>
                    <h3 style={styles.positionTitle}>{offer.position}</h3>
                    <p style={styles.companyName}>{offer.company}</p>
                  </div>
                </div>
                <div style={offer.isVerified ? styles.verifiedBadge : styles.pendingBadge}>
                  {offer.isVerified ? '✓ Verified' : '⏳ Pending'}
                </div>
              </div>

              <div style={styles.jobMeta}>
                <span style={styles.metaTag}>📍 {offer.location}</span>
                <span style={styles.metaTag}>🕒 {offer.type}</span>
                <span style={{...styles.metaTag, ...styles.salaryTag}}>💰 {offer.salary}</span>
                <span style={styles.metaTag}>📊 {offer.experience}</span>
              </div>

              <p style={styles.description}>{offer.description}</p>

              <div style={styles.requirements}>
                {offer.requirements.map((req, index) => (
                  <span key={index} style={styles.requirement}>{req}</span>
                ))}
              </div>

              <div style={styles.offerFooter}>
                <div style={styles.contactInfo}>
                  📧 {offer.contactEmail} • 📅 {offer.postedDate}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <a href="#" style={styles.documentBadge}>
                    📎 {offer.document}
                  </a>
                  {isStudent() && (
                    <button 
                      style={{
                        background: 'rgba(39, 174, 96, 0.2)', 
                        color: '#2ecc71', 
                        border: '1px solid rgba(46, 204, 113, 0.3)',
                        padding: '0.4rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => alert(`Applying for ${offer.position} at ${offer.company}`)}
                    >
                      🚀 Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Upload Job Offer Document</h3>
            
            <div
              style={styles.uploadArea}
              onClick={() => document.getElementById('fileInput').click()}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f4fd'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            >
              <input
                id="fileInput"
                type="file"
                style={styles.fileInput}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
              />
              <div style={styles.uploadText}>
                📄 Click to upload job offer document
              </div>
              <div style={styles.uploadSubtext}>
                Supported formats: PDF, DOC, DOCX, TXT
              </div>
            </div>

            {uploadedFile && (
              <div style={styles.fileInfo}>
                <div style={styles.fileName}>{uploadedFile.name}</div>
                <div style={styles.fileSize}>
                  Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            <div style={styles.modalActions}>
              <button
                style={{
                  ...styles.actionButton,
                  ...styles.cancelButton,
                  ...(uploading && styles.disabledButton)
                }}
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                onMouseEnter={(e) => !uploading && (e.target.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={(e) => e.target.style.background = uploading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  ...styles.submitButton,
                  ...(uploading && styles.disabledButton)
                }}
                onClick={handleSubmitOffer}
                disabled={uploading || !uploadedFile}
                onMouseEnter={(e) => !uploading && uploadedFile && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {uploading ? 'Uploading...' : 'Submit Offer'}
              </button>
            </div>

            <div style={styles.supportedFormats}>
              <p>Upload your job posting as a document. We'll extract the details automatically.</p>
              <p>Make sure the document includes: Company name, Position, Requirements, and Contact information.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOffersPortal;