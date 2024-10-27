import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Register from './components/User/Register';
import Login from './components/User/UserLogin'; // Assuming you have a Login component
import Main from './components/User/MainPage'; // Assuming you have a MainPage component
import UserPage from './components/User/UserPage'; // Assuming you have a UserPage component
import Header from './components/Header'; // Assuming you have a Header component

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/user" element={<UserPage />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
