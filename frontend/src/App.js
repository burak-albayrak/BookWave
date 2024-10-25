import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // UserContext'i import et
import Header from './components/Header';
import MainPage from './components/User/MainPage';
import UserPage from './components/User/UserPage';
import Register from './components/User/Register';
import Login from './components/User/UserLogin';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Register />} /> {/* İlk açılışta Register'ı göster */}
                    <Route path="/main" element={<MainPage />} /> {/* Ana sayfa */}
                    <Route path="/user" element={<UserPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
