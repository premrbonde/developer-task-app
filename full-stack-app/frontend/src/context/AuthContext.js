import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
            // Optionally fetch user profile here to validate token
            api.get('/profile')
                .then(res => setUser(res.data))
                .catch(() => {
                    // Token is invalid
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Inside frontend/src/context/AuthContext.js

const login = async (email, password) => {
    // Make the API call to the backend login endpoint
    const response = await api.post('/auth/login', { email, password });

    // Destructure the token and user from the response data
    const { token, user } = response.data;

    // --- THIS IS THE CRITICAL LINE ---
    // Save the received token to the browser's local storage
    localStorage.setItem('token', token);

    // Set the authorization header for all future API requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Update the application's state
    setUser(user);
    setIsAuthenticated(true);
};

    const signup = async (username, email, password) => {
        await api.post('/auth/signup', { username, email, password });
    };



    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);