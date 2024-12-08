import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import * as S from '../../assets/styles/AuthStyles';
import CircularProgress from '@mui/material/CircularProgress';
import { API_URL } from '../../services/api';
import styled from "styled-components";

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

    const [inputErrors, setInputErrors] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
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
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USER', payload: data });
                if (data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/main');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInputErrors({});

        const birthDate = new Date(registerData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            setInputErrors(prev => ({
                ...prev,
                dateOfBirth: 'Date of birth cannot be in the future'
            }));
            setLoading(false);
            return;
        }

        if (age < 12) {
            setInputErrors(prev => ({
                ...prev,
                dateOfBirth: 'You must be at least 12 years old to register'
            }));
            setLoading(false);
            return;
        }

        if (age > 100) {
            setInputErrors(prev => ({
                ...prev,
                dateOfBirth: 'Invalid date of birth'
            }));
            setLoading(false);
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setInputErrors({
                confirmPassword: 'Passwords do not match'
            });
            setLoading(false);
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setInputErrors({
                confirmPassword: 'Passwords do not match'
            });
            setLoading(false);
            return;
        }

        try {
            const formData = {
                name: registerData.name,
                surname: registerData.surname,
                email: registerData.email,
                password: registerData.password,
                dateOfBirth: registerData.dateOfBirth
            };

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const newInputErrors = {};
                    data.errors.forEach(error => {
                        if (error.includes('Name')) newInputErrors.name = error;
                        if (error.includes('Surname')) newInputErrors.surname = error;
                        if (error.includes('Email')) newInputErrors.email = error;
                        if (error.includes('Password')) newInputErrors.password = error;
                    });
                    setInputErrors(newInputErrors);
                } else {
                    setError(['Registration failed. Please try again.']);
                }
                setLoading(false);
                return;
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
                dateOfBirth: ''
            });
        } catch (err) {
            console.error('Full error:', err);
            setError(['Network error occurred. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Container>
            <S.SignUpContainer isLogin={isLogin}>
                <S.Form onSubmit={handleRegisterSubmit}>
                    <S.Title2>Create Account</S.Title2>

                    {error && Array.isArray(error) && error.length > 0 && (
                        <ErrorList>
                            {error.map((err, index) => (
                                <ErrorItem key={index}>{err}</ErrorItem>
                            ))}
                        </ErrorList>
                    )}
                    <S.InputContainer>
                        <S.Input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            required
                        />
                        {inputErrors.name && <S.InputError>{inputErrors.name}</S.InputError>}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.Input
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            value={registerData.surname}
                            onChange={handleRegisterChange}
                            required
                        />
                        {inputErrors.surname && <S.InputError>{inputErrors.surname}</S.InputError>}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                        />
                        {inputErrors.email && <S.InputError>{inputErrors.email}</S.InputError>}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                        />
                        {inputErrors.password && <S.InputError>{inputErrors.password}</S.InputError>}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                        />
                        {inputErrors.confirmPassword && <S.InputError>{inputErrors.confirmPassword}</S.InputError>}
                    </S.InputContainer>

                    <S.InputContainer>
                        <S.Input
                            type="date"
                            name="dateOfBirth"
                            value={registerData.dateOfBirth}
                            onChange={handleRegisterChange}
                            required
                            max={new Date().toISOString().split('T')[0]}
                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} // 100 yıl öncesine kadar seçilebilir
                            placeholder="Date of Birth"
                            title="Please enter your date of birth"
                        />
                        {inputErrors.dateOfBirth && <S.InputError>{inputErrors.dateOfBirth}</S.InputError>}
                    </S.InputContainer>
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

const ErrorList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 10px 0;
    color: #f44336;
    background-color: #ffebee;
    border-radius: 4px;
    padding: 10px;
`;

const ErrorItem = styled.li`
    margin: 5px 0;
    display: flex;
    align-items: center;
    
    &:before {
        content: "•";
        margin-right: 8px;
        color: #f44336;
    }
`;

export default AuthPage;