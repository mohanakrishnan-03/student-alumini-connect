import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile by ID
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user in state and localStorage
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to fetch profile' 
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update user in state and localStorage
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.message || 'Failed to update profile' 
        };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  // Student Login
  const loginStudent = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please check your connection.' };
    }
  };

  // Alumni Login
  const loginAlumni = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login/alumni`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please check your connection.' };
    }
  };

  // Guest Login
  const loginGuest = () => {
    const guestUser = {
      _id: 'guest',
      fullName: 'Guest User',
      userType: 'guest'
    };
    const guestToken = 'guest-token';
    
    localStorage.setItem('token', guestToken);
    localStorage.setItem('user', JSON.stringify(guestUser));
    setToken(guestToken);
    setUser(guestUser);
    return { success: true };
  };

  // General login function that routes to appropriate endpoint
  const login = async (email, password, userType) => {
    if (userType === 'student') {
      return await loginStudent(email, password);
    } else if (userType === 'alumni') {
      return await loginAlumni(email, password);
    } else {
      return { success: false, error: 'Invalid user type' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please check your connection.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Check user type
  const isStudent = () => {
    return user?.userType === 'student';
  };

  const isAlumni = () => {
    return user?.userType === 'alumni';
  };

  const isGuest = () => {
    return user?.userType === 'guest';
  };

  // Fetch all users for chat
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, users: data.users };
      } else {
        return { success: false, error: data.message || 'Failed to fetch users' };
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, error: 'Network error.' };
    }
  };

  const value = {
    // State
    user,
    token,
    loading,
    
    // Authentication methods
    login,
    loginStudent,
    loginAlumni,
    loginGuest,
    register,
    logout,
    
    // User management
    updateUser,
    isAuthenticated,
    isStudent,
    isAlumni,
    isGuest,
    
    // Profile methods
    fetchUserProfile,
    updateProfile,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};