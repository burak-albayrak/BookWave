import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import * as S from '../../assets/styles/AuthStyles';
import CircularProgress from '@mui/material/CircularProgress';
import { API_URL } from '../../services/api';

const AuthPage = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        location: ''
    });

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            dispatch({ type: 'SET_USER', payload: data });
            navigate('/main');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Tarih formatını yyyy-MM-dd olarak gönder
            const formData = {
                name: registerData.name,
                surname: registerData.surname,
                email: registerData.email,
                password: registerData.password,
                dateOfBirth: registerData.dateOfBirth, // HTML date input zaten yyyy-MM-dd formatında
                location: registerData.location || ''
            };

            console.log('Sending data:', formData); // Debug için

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data || 'Registration failed');
            }

            setIsLogin(true);
            setError('');
            alert('Registration successful! Please login.');
            setRegisterData({
                name: '',
                surname: '',
                email: '',
                password: '',
                confirmPassword: '',
                dateOfBirth: '',
                location: ''
            });
        } catch (err) {
            console.error('Full error:', err);
            setError(err.message || 'Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Container>
            <S.SignUpContainer isLogin={isLogin}>
                <S.Form onSubmit={handleRegisterSubmit}>
                    <S.Title>Create Account</S.Title>
                    <S.Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={registerData.surname}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Input
                        type="date"
                        name="dateOfBirth"
                        value={registerData.dateOfBirth}
                        onChange={handleRegisterChange}
                        required
                        placeholder="Date of Birth"
                        title="Please enter your date of birth"
                    />
                    <S.Input
                        type="text"
                        name="location"
                        placeholder="Address"
                        value={registerData.location}
                        onChange={handleRegisterChange}
                        required
                    />
                    <S.Button type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </S.Button>
                </S.Form>
            </S.SignUpContainer>

            <S.SignInContainer isLogin={isLogin}>
                <S.Form onSubmit={handleLoginSubmit}>
                    <S.Logo src={`${process.env.PUBLIC_URL}/logo.png`} alt="BookWave Logo" />
                    <S.Title2>Sign in to BookWave</S.Title2>
                    <S.Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                    />
                    <S.Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                    />
                    <S.Button type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </S.Button>
                </S.Form>
            </S.SignInContainer>
            <S.OverlayContainer isLogin={isLogin}>
                <S.Overlay isLogin={isLogin}>
                    <S.LeftOverlayPanel isLogin={isLogin}>
                        <S.Logo src={`${process.env.PUBLIC_URL}/logo.png`} alt="BookWave Logo" />
                        <S.Title>Welcome Back!</S.Title>
                        <S.Text>Already have an account? Sign in here</S.Text>
                        <S.GhostButton onClick={() => setIsLogin(true)}>
                            Sign In
                        </S.GhostButton>
                    </S.LeftOverlayPanel>

                    <S.RightOverlayPanel isLogin={isLogin}>
                        <S.Title>Hello, Bookworm!</S.Title>
                        <S.Text>Don't have an account? Sign up here</S.Text>
                        <S.GhostButton onClick={() => setIsLogin(false)}>
                            Sign Up
                        </S.GhostButton>
                    </S.RightOverlayPanel>
                </S.Overlay>
            </S.OverlayContainer>

            {error && <S.ErrorText>{error}</S.ErrorText>}
        </S.Container>
    );
};

export default AuthPage;