// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
//   const [isAdmin, setIsAdmin] = useState(!!user.IsAdmin); // Check for IsAdmin explicitly

//   useEffect(() => {
//     // Initial load from localStorage
//     const token = localStorage.getItem('token');
//     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//     console.log('Initial user from localStorage:', storedUser); // Debug initial user
//     setIsAuthenticated(!!token);
//     setUser(storedUser);
//     setIsAdmin(storedUser.IsAdmin); // Explicitly check IsAdmin
//     console.log('Initial isAdmin:', !!storedUser.IsAdmin); // Debug initial isAdmin
//   }, []);

//   const login = (token, userData) => {
//     console.log('Login userData received:', userData); // Debug received userData
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsAuthenticated(true);
//     setUser(userData);
//     setIsAdmin(!!userData.IsAdmin); // Ensure IsAdmin is checked correctly
//     console.log('Logged in user:', userData); // Debug logged-in user
//     console.log('Logged in isAdmin:', !!userData.IsAdmin); // Debug logged-in isAdmin
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser({});
//     setIsAdmin(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };