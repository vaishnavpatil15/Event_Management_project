import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:3000/api';
  axios.defaults.withCredentials = true;

  // Add request interceptor to add auth token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success && response.data.data) {
          console.log('Auth check user data:', response.data.data); // Debug log
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post('/auth/login', userData);
      if (response.data.success && response.data.data) {
        // Store token in localStorage
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        
        // Store user data
        const user = response.data.data.user;
        console.log('Setting user data:', user); // Debug log
        setUser(user);
        setIsAuthenticated(true);
        
        return response.data;
      } else {
        throw new Error('Login failed: Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success) {
        // Store token in localStorage if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success && response.data.data) {
        console.log('Refreshed user data:', response.data.data);
        setUser(response.data.data);
        setIsAuthenticated(true);
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      if (error.response?.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUserData
      }}
    >
      {!isLoading && children}
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
