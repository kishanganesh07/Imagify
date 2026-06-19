/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [credit, setCredit] = useState(0);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const token = localStorage.getItem('token');

    // Apply theme class to <html> element
    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.add('light');
            html.classList.remove('dark');
        } else {
            html.classList.add('dark');
            html.classList.remove('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const loadCredits = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.error("Failed to load credits:", error.message);
        }
    };

    useEffect(() => {
        if (token) {
            loadCredits();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const value = {
        user, setUser,
        showLogin, setShowLogin,
        showPricing, setShowPricing,
        backendUrl, token,
        credit, loadCredits, logout,
        theme, toggleTheme
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
