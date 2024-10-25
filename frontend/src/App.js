// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/User/UserLogin';
import Register from './components/User/Register';
import MainPage from './components/User/MainPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPage from './components/Admin/AdminPage';
import UserPage from './components/User/UserPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/user" element={<UserPage />} />
            </Routes>
        </Router>
    );
};

export default App;
