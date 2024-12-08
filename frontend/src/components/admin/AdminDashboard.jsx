import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUsers, FaBook } from 'react-icons/fa';
import UserManagement from './UserManagement';
import BookManagement from './BookManagement';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('users');

    return (
        <DashboardContainer>
            <Sidebar>
                <SidebarHeader>
                    <AdminTitle>Admin Panel</AdminTitle>
                    <AdminSubtitle>Management Dashboard</AdminSubtitle>
                </SidebarHeader>

                <NavButtons>
                    <NavButton
                        active={activeSection === 'users'}
                        onClick={() => setActiveSection('users')}
                    >
                        <FaUsers />
                        <span>User Management</span>
                    </NavButton>

                    <NavButton
                        active={activeSection === 'books'}
                        onClick={() => setActiveSection('books')}
                    >
                        <FaBook />
                        <span>Book Management</span>
                    </NavButton>
                </NavButtons>
            </Sidebar>

            <MainContent>
                <ContentHeader>
                    <SectionTitle>
                        {activeSection === 'users' && 'User Management'}
                        {activeSection === 'books' && 'Book Management'}
                    </SectionTitle>
                </ContentHeader>

                <ContentArea>
                    {activeSection === 'users' && <UserManagement />}
                    {activeSection === 'books' && <BookManagement />}
                </ContentArea>
            </MainContent>
        </DashboardContainer>
    );
};

const DashboardContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const Sidebar = styled.div`
    width: 280px;
    background: white;
    padding: 2rem;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
`;

const SidebarHeader = styled.div`
    margin-bottom: 3rem;
`;

const AdminTitle = styled.h1`
    color: #2E7D32;
    font-size: 1.8rem;
    margin: 0;
`;

const AdminSubtitle = styled.p`
    color: #666;
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
`;

const NavButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const NavButton = styled.button`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background: ${props => props.active ? '#4CAF50' : 'transparent'};
    color: ${props => props.active ? 'white' : '#333'};
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
    font-size: 1rem;

    &:hover {
        background: ${props => props.active ? '#2E7D32' : '#f5f5f5'};
    }

    svg {
        font-size: 1.2rem;
    }
`;

const MainContent = styled.main`
    flex: 1;
    padding: 2rem;
`;

const ContentHeader = styled.div`
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
    color: #2E7D32;
    margin: 0;
    font-size: 1.5rem;
`;

const ContentArea = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-height: 500px;
`;

export default AdminDashboard;