import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Whenever the app loads, check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT payload
        
        // Check if the token is expired (JWT expiration is in seconds)
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Keep user logged in
          setUser({ email: decoded.sub, role: decoded.role });
        }
      } catch (error) {
        logout(); // If token is invalid/malformed, log them out
      }
    }
    setLoading(false); // Finished checking
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
