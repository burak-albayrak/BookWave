import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/common/Header';
import MainPage from './components/User/MainPage';
import UserDashboard from './components/User/UserDashboard';
import AdminPage from './components/admin/AdminPage';
import AuthPage from './components/auth/AuthPage';

const AppContent = () => {
    const location = useLocation();
    const showHeader = location.pathname !== '/';

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <UserProvider>
            <Router>
                <AppContent />
            </Router>
        </UserProvider>
    );
};

export default App;