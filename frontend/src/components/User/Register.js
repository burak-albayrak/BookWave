import React, { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    // State variables to hold user input
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [location, setLocation] = useState('');

    // Access the dispatch method from UserContext
    const { dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    // Handle the registration form submission
    const handleRegister = (e) => {
        e.preventDefault();

        // Dispatch the user data to the UserContext
        dispatch({
            type: 'SET_USER',
            payload: { name, surname, email, dob, location }
        });

        // Redirect to the main page after successful registration
        navigate('/main');
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                />
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
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
