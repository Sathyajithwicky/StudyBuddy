import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Function to validate stored token
  const validateToken = async (token) => {
    try {
      const response = await axios.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            await logout();
          } else {
            // Validate token with server
            const isValid = await validateToken(storedToken);
            if (isValid) {
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
              // Set up automatic token refresh
              const decoded = jwtDecode(storedToken);
              const timeUntilExpiry = decoded.exp * 1000 - Date.now();
              if (timeUntilExpiry > 0) {
                setTimeout(refreshToken, timeUntilExpiry - 5 * 60 * 1000); // Refresh 5 minutes before expiry
              }
            } else {
              await logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        login(userData, newToken);
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const login = async (userData, authToken) => {
    try {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set up axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Set up token refresh
      const decoded = jwtDecode(authToken);
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      if (timeUntilExpiry > 0) {
        setTimeout(refreshToken, timeUntilExpiry - 5 * 60 * 1000); // Refresh 5 minutes before expiry
      }
    } catch (error) {
      console.error('Login error:', error);
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      login, 
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 