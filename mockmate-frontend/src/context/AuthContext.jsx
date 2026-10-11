import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current active logged in user
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mockmate_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Database of registered accounts in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('mockmate_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authRedirectMessage, setAuthRedirectMessage] = useState('');

  // Persist current logged in session
  useEffect(() => {
    if (user) {
      localStorage.setItem('mockmate_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockmate_auth_user');
    }
  }, [user]);

  // Persist registered users directory
  useEffect(() => {
    localStorage.setItem('mockmate_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const openAuthModal = (mode = 'login', message = '') => {
    setAuthModalMode(mode);
    setAuthRedirectMessage(message);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectMessage('');
  };

  // Register a brand new user
  const register = async (userData) => {
    const normalizedEmail = userData.email.trim().toLowerCase();

    // 1. Check if user already registered locally
    const alreadyExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (alreadyExists) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      jobRole: userData.jobRole || 'Full Stack Web Developer',
      experienceLevel: userData.experienceLevel || 'Junior (1-2 years)',
      createdAt: new Date().toISOString()
    };

    // 2. Try registering to backend (Supabase) as well
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...newUser
      }, { timeout: 3500 });
    } catch (backendErr) {
      console.warn("Backend sync notice (account saved securely locally):", backendErr.message);
    }

    // 3. Save into registered users collection
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('mockmate_registered_users', JSON.stringify(updatedUsers));

    // 4. Set current session to the new registered user
    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      jobRole: newUser.jobRole,
      experienceLevel: newUser.experienceLevel
    });

    closeAuthModal();
    return { success: true, user: newUser };
  };

  // Login: ONLY allow users who have already registered
  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check local registered users list
    const foundLocalUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    // 2. If not found locally, check backend database
    let foundBackendUser = null;
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: normalizedEmail,
        password
      }, { timeout: 3500 });

      if (response.data && response.data.user) {
        foundBackendUser = response.data.user;
      }
    } catch (err) {
      // Backend reported user not found or is offline
      if (err.response && err.response.status === 404) {
        throw new Error('No account found with this email. Please register first.');
      }
    }

    // 3. If neither found locally nor in backend, reject login!
    if (!foundLocalUser && !foundBackendUser) {
      throw new Error('No account found with this email. Please click "Sign Up" to create an account first.');
    }

    // 4. Verify password if local record contains password
    if (foundLocalUser && foundLocalUser.password) {
      if (foundLocalUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
    }

    // 5. User is verified as registered! Log them in.
    const authenticatedUser = foundLocalUser
      ? {
          id: foundLocalUser.id,
          name: foundLocalUser.name,
          email: foundLocalUser.email,
          jobRole: foundLocalUser.jobRole,
          experienceLevel: foundLocalUser.experienceLevel
        }
      : foundBackendUser;

    setUser(authenticatedUser);
    closeAuthModal();
    return { success: true, user: authenticatedUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockmate_auth_user');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...updatedFields };
      localStorage.setItem('mockmate_auth_user', JSON.stringify(updated));
      return updated;
    });

    setRegisteredUsers(prev => {
      const updated = prev.map(u => 
        (u.email?.toLowerCase() === (user?.email || '').toLowerCase())
          ? { ...u, ...updatedFields }
          : u
      );
      localStorage.setItem('mockmate_registered_users', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        authRedirectMessage,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        updateUser,
        logout,
        registeredUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
