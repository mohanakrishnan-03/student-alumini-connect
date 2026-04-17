// Events.js - Complete single file with inline styles
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleEvents = [
  { id: 1, title: "Team Lunch", date: "2025-11-28", time: "12:30", location: "Cafeteria", description: "Everyone welcome! Let's have a great time together.", image: null },
  { id: 2, title: "Quick Standup", date: "", time: "09:15", location: "", description: "Daily team sync for project updates", image: null },
  { id: 3, title: "Alumni Meetup", date: "2025-12-05", time: "18:00", location: "Main Auditorium", description: "Annual alumni gathering with networking opportunities", image: null },
];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(sampleEvents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setForm({ ...form, image: file, imagePreview: preview });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null, imagePreview: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Event title is required!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location,
      description: form.description,
      image: form.imagePreview,
    };

    setEvents([newEvent, ...events]);
    setForm({ title: "", date: "", time: "", location: "", description: "", image: null, imagePreview: null });
    setShowForm(false);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#0f0f1a",
      minHeight: "100vh",
      color: "#f8fafc",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },

    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
    },

    backButton: {
      background: "rgba(255,255,255,0.07)",
      color: "rgba(255,255,255,0.8)",
      border: "1px solid rgba(255,255,255,0.12)",
      padding: "0.6rem 1.2rem",
      borderRadius: "50px",
      fontSize: "0.88rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif",
    },

    titleContainer: { display: "flex", flexDirection: "column" },
    title: { color: "#fff", fontSize: "2rem", margin: 0, fontWeight: "800", letterSpacing: "-0.5px" },
    subtitle: { color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", margin: "0.25rem 0 0 0" },
    addButton: {
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white", border: "none",
      padding: "0.65rem 1.4rem", borderRadius: "50px",
      fontSize: "0.9rem", fontWeight: "700", cursor: "pointer",
      display: "flex", alignItems: "center", gap: "0.5rem",
      transition: "all 0.2s ease", fontFamily: "'Inter', sans-serif",
      boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
    },

    eventsList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "1.2rem", marginTop: "1rem",
    },
    eventCard: {
      background: "rgba(255,255,255,0.04)",
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.09)",
      transition: "all 0.3s ease",
    },

    eventImageContainer: {
      width: "100%", height: "160px",
      backgroundColor: "rgba(99,102,241,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    },
    eventImage: { width: "100%", height: "100%", objectFit: "cover" },
    eventContent: { padding: "1.25rem" },

    eventHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" },
    eventTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#fff", margin: 0, lineHeight: "1.4" },
    eventMeta: { display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" },
    metaItem: { display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.4)", fontSize: "0.83rem" },
    eventDescription: { color: "rgba(255,255,255,0.45)", lineHeight: "1.6", marginBottom: "1.2rem", fontSize: "0.88rem" },
    eventActions: { display: "flex", gap: "0.6rem", paddingTop: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.07)" },

    rsvpBtn: {
      flex: 1, padding: "0.65rem", borderRadius: "10px", border: "none", cursor: "pointer",
      fontWeight: "700", transition: "all 0.2s", fontSize: "0.85rem",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
      fontFamily: "'Inter', sans-serif",
    },
    shareBtn: {
      flex: 1, padding: "0.65rem", borderRadius: "10px", cursor: "pointer",
      fontWeight: "600", transition: "all 0.2s", fontSize: "0.85rem",
      background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Inter', sans-serif",
    },

    emptyState: {
      textAlign: "center", padding: "4rem 2rem",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
    },
    emptyIcon: { fontSize: "3.5rem", marginBottom: "1.2rem", display: "block" },
    emptyTitle: { color: "#fff", fontSize: "1.3rem", marginBottom: "0.5rem", fontWeight: "700" },
    emptyText: { color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: "1.5rem" },
    createFirstBtn: {
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none",
      padding: "0.75rem 2rem", borderRadius: "50px", cursor: "pointer",
      fontSize: "0.9rem", fontWeight: "700", transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif", boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
    },

    modalOverlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem",
    },
    modalContent: {
      background: "rgba(18,18,32,0.95)",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px", padding: "2rem",
      maxWidth: "500px", width: "100%", maxHeight: "90vh", overflowY: "auto",
    },

    modalTitle: { fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "1.5rem" },
    input: {
      width: "100%", padding: "0.8rem 1rem", marginBottom: "1rem",
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "12px", fontSize: "0.9rem", boxSizing: "border-box",
      transition: "all 0.2s", color: "#f8fafc", fontFamily: "'Inter', sans-serif",
      outline: "none",
    },
    textarea: { minHeight: "90px", resize: "vertical" },
    inputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" },
    uploadArea: {
      border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "12px",
      padding: "1.5rem", textAlign: "center",
      background: "rgba(255,255,255,0.03)", marginBottom: "1.5rem",
      cursor: "pointer", transition: "all 0.2s",
    },
    uploadText: { color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", marginBottom: "0.4rem" },
    uploadSubtext: { color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" },
    modalButtons: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" },
    cancelBtn: {
      padding: "0.8rem", borderRadius: "12px", cursor: "pointer",
      fontSize: "0.9rem", fontWeight: "600", transition: "all 0.2s",
      background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif",
    },
    submitBtn: {
      padding: "0.8rem", borderRadius: "12px", border: "none", cursor: "pointer",
      fontSize: "0.9rem", fontWeight: "700", transition: "all 0.2s",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
      fontFamily: "'Inter', sans-serif",
    },

    // Image Preview
    imagePreview: {
      marginBottom: "1.5rem",
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
    },

    previewImage: {
      width: "100%",
      maxHeight: "200px",
      objectFit: "cover",
      borderRadius: "8px",
    },

    removeImage: {
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.25rem",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header with Back Button - Unified Design */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={() => navigate('/home')}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            ← Back to Home
          </button>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>📅 Events</h1>
            <p style={styles.subtitle}>Create and join events with the community</p>
          </div>
        </div>
        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#219a52'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
        >
          + Add Event
        </button>
      </div>

      {/* Events List */}
      <div style={styles.eventsList}>
        {events.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <h3 style={styles.emptyTitle}>No events yet</h3>
            <p style={styles.emptyText}>Be the first to create an event!</p>
            <button 
              style={styles.createFirstBtn}
              onClick={() => setShowForm(true)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              style={styles.eventCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.eventImageContainer}>
                {event.image ? (
                  <img src={event.image} alt={event.title} style={styles.eventImage} />
                ) : (
                  <span style={{ fontSize: '3rem', color: '#94a3b8' }}>📅</span>
                )}
              </div>
              
              <div style={styles.eventContent}>
                <div style={styles.eventHeader}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                </div>

                <div style={styles.eventMeta}>
                  {(event.date || event.time) && (
                    <div style={styles.metaItem}>
                      <span>🕒</span>
                      {event.date && <span>{event.date}</span>}
                      {event.date && event.time && <span> • </span>}
                      {event.time && <span>{event.time}</span>}
                    </div>
                  )}

                  {event.location && (
                    <div style={styles.metaItem}>
                      <span>📍</span>
                      {event.location}
                    </div>
                  )}
                </div>

                {event.description && (
                  <p style={styles.eventDescription}>{event.description}</p>
                )}

                <div style={styles.eventActions}>
                  <button 
                    style={styles.rsvpBtn}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                  >
                    RSVP
                  </button>
                  <button 
                    style={styles.shareBtn}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create New Event</h3>
            
            <form onSubmit={handleSubmit}>
              {form.imagePreview && (
                <div style={styles.imagePreview}>
                  <img src={form.imagePreview} alt="Preview" style={styles.previewImage} />
                  <button 
                    type="button"
                    style={styles.removeImage}
                    onClick={removeImage}
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                style={styles.input}
                type="text"
                placeholder="Event Title (required)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="Date"
                />
                <input
                  style={styles.input}
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="Time"
                />
              </div>

              <input
                style={styles.input}
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div 
                style={styles.uploadArea}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div style={styles.uploadText}>📎 Add Photo (optional)</div>
                <div style={styles.uploadSubtext}>Click to upload image</div>
              </div>

              <div style={styles.modalButtons}>
                <button 
                  type="button" 
                  style={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cbd5e1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}