import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Pages & Features
import LandingPage from './LandingPage';
import RegistrationLogin from './RegistrationLogin';
import StudentLogin from './components/StudentLogin';
import AlumniLogin from './components/AlumniLogin';
import HomePage from './HomePage';
import Community from './Community';
import Chat from './Chat';
import Events from './Events';
import Stories from './Stories';
import Jobs from './Jobs';
import Profile from './Profile';
import ResumeAnalyzer from './ResumeAnalyzer';
import ChatBot from './ChatBot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register/student" element={<RegistrationLogin userType="student" />} />
            <Route path="/register/alumni" element={<RegistrationLogin userType="alumni" />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/alumni" element={<AlumniLogin />} />
            <Route path="/chatbot" element={<ChatBot />} />

            {/* Protected Routes - Require Authentication */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/resume" element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } />
            
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            
            <Route path="/stories" element={
              <ProtectedRoute>
                <Stories />
              </ProtectedRoute>
            } />
            
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;