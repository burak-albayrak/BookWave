import React, { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate, Link } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Access dispatch from UserContext
    const { dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    // Login handler function
    const handleLogin = (e) => {
        e.preventDefault();

        // Check if the login is for an admin
        const isAdmin = email === 'admin@example.com' && password === 'admin123';

        // Dispatch the login action
        dispatch({
            type: 'SET_USER',
            payload: {
                user: { email },
                isAdmin,
            }
        });

        // Redirect to main page after login
        navigate('/main');
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default UserLogin;
