import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider
import Header from './components/Header';
import MainPage from './components/User/MainPage';
import Register from './components/User/Register';
import Login from './components/User/UserLogin';
import UserPage from './components/User/UserPage';
import AdminPage from './components/Admin/AdminPage';

const App = () => {
    return (
        <UserProvider> {/* Wrap your app with UserProvider */}
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
