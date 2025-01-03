import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from '../../context/UserContext';

const Header = () => {
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const getInitials = (name, surname) => {
        if (!name || !surname) return '';
        return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    };

    return (
        <HeaderContainer>
            <LeftSection>
                <BrandName onClick={() => navigate('/main')}>BookWave</BrandName>
                {state.user && !state.user.isAdmin && <NavLink to="/main">Home</NavLink>}
                {state.user && !state.user.isAdmin && <NavLink to="/user">My Books</NavLink>}
            </LeftSection>

            <RightSection>
                {state.user && !state.user.isAdmin && (
                    <>
                        <ProfileLink to="/profile">
                            <UserAvatar>
                                {getInitials(state.user.name, state.user.surname)}
                            </UserAvatar>
                            <span>Profile</span>
                        </ProfileLink>
                    </>
                )}

                {state.user && (
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                )}
            </RightSection>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    background-color: #ffffff;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
`;

const BrandName = styled.h1`
    color: #4CAF50;
    margin: 0;
    font-size: 1.8rem;
    cursor: pointer;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
        color: #2E7D32;
    }
`;

const NavLink = styled(Link)`
    color: #4CAF50;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
        background-color: #e8f5e9;
        color: #2E7D32;
    }
`;

const ProfileLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4CAF50;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
        background-color: #e8f5e9;
    }
`;

const UserAvatar = styled.div`
    width: 35px;
    height: 35px;
    background-color: #4CAF50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
`;

const LogoutButton = styled.button`
    background: none;
    border: 1px solid #4CAF50;
    color: #4CAF50;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background-color: #4CAF50;
        color: white;
    }
`;

export default Header;