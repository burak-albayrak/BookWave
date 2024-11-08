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

    return (
        <HeaderContainer>
            <LeftSection>
                <BrandName onClick={() => navigate('/main')}>BookWave</BrandName>
                <NavLink to="/main">Home</NavLink>
                {state.user && <NavLink to="/user">My Books</NavLink>}
            </LeftSection>

            <RightSection>
                {state.user?.isAdmin && (
                    <NavLink to="/admin">Admin Panel</NavLink>
                )}

                {state.user && (
                    <>
                        <UserInfo>
                            <UserAvatar>
                                {state.user.name[0]}{state.user.surname[0]}
                            </UserAvatar>
                            <UserName>{state.user.name} {state.user.surname}</UserName>
                        </UserInfo>
                        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                    </>
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

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const UserName = styled.span`
    color: #333;
    font-weight: 500;
`;

const LogoutButton = styled.button`
    background-color: transparent;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background-color: #4CAF50;
        color: white;
    }
`;

export default Header;