import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../services/api';
import LoadingSpinner from '../../assets/styles/LoadingSpinner';
import { FaEdit, FaTrash, FaBook, FaUserAlt } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBooksModal, setShowBooksModal] = useState(false);
    const [selectedUserBooks, setSelectedUserBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        surname: '',
        email: '',
        isAdmin: false
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewBooks = async (userId) => {
        setLoadingBooks(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/users/${userId}/books`);
            if (!response.ok) throw new Error('Failed to fetch user books');
            const data = await response.json();
            setSelectedUserBooks(data);
            setShowBooksModal(true);
        } catch (err) {
            setError('Failed to load user books');
            console.error(err);
        } finally {
            setLoadingBooks(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name,
            surname: user.surname,
            email: user.email,
            isAdmin: user.isAdmin
        });
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/users/${selectedUser.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) throw new Error('Failed to update user');

            setUsers(users.map(user =>
                user.userID === selectedUser.userID
                    ? { ...user, ...editFormData }
                    : user
            ));
            setShowEditModal(false);
        } catch (err) {
            setError('Failed to update user');
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete user');

            setUsers(users.filter(user => user.userID !== userId));
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return (
        <Container>
            <UserList>
                {users.map((user) => (
                    <UserCard key={user.userID}>
                        <UserInfo>
                            <UserAvatar>
                                <FaUserAlt />
                            </UserAvatar>
                            <UserDetails>
                                <UserName>{user.name} {user.surname}</UserName>
                                <UserEmail>{user.email}</UserEmail>
                                <UserRole>{user.isAdmin ? 'Administrator' : 'User'}</UserRole>
                            </UserDetails>
                        </UserInfo>
                        <Actions>
                            <ActionButton onClick={() => handleEditUser(user)}>
                                <FaEdit /> Edit
                            </ActionButton>
                            <ActionButton onClick={() => handleViewBooks(user.userID)}>
                                <FaBook /> View Books
                            </ActionButton>
                            <ActionButton danger onClick={() => handleDeleteUser(user.userID)}>
                                <FaTrash /> Delete
                            </ActionButton>
                        </Actions>
                    </UserCard>
                ))}
            </UserList>

            {showBooksModal && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h2>User's Rented Books</h2>
                            <CloseButton onClick={() => setShowBooksModal(false)}>&times;</CloseButton>
                        </ModalHeader>

                        {loadingBooks ? (
                            <LoadingSpinner />
                        ) : selectedUserBooks.length === 0 ? (
                            <EmptyState>
                                <FaBook size={48} color="#ccc" />
                                <p>No books rented by this user.</p>
                            </EmptyState>
                        ) : (
                            <BooksList>
                                {selectedUserBooks.map((bookData) => (
                                    <BookItem key={`${bookData.bookDetails.isbn}-${bookData.bookDetails.startDate}`}>
                                        <BookImageSection>
                                            {bookData.bookDetails.imageUrlMedium ? (
                                                <BookImage
                                                    src={bookData.bookDetails.imageUrlMedium}
                                                    alt={bookData.bookDetails.bookTitle}
                                                />
                                            ) : (
                                                <NoImageContainer>No Image</NoImageContainer>
                                            )}
                                        </BookImageSection>
                                        <BookContent>
                                            <BookInfo>
                                                <BookTitle>{bookData.bookDetails.bookTitle}</BookTitle>
                                                <BookAuthor>{bookData.bookDetails.bookAuthor}</BookAuthor>
                                            </BookInfo>

                                            <RentalInfo>
                                                <RentalDates>
                                                    <DateInfo>
                                                        <Label>Start Date</Label>
                                                        <span>{new Date(bookData.bookDetails.startDate).toLocaleDateString()}</span>
                                                    </DateInfo>
                                                    <DateInfo>
                                                        <Label>Due Date</Label>
                                                        <span>{new Date(bookData.bookDetails.endDate).toLocaleDateString()}</span>
                                                    </DateInfo>
                                                </RentalDates>

                                                <StatusBadge status={bookData.status}>
                                                    {bookData.status}
                                                    {bookData.remainingDays > 0 && ` (${bookData.remainingDays} days remaining)`}
                                                </StatusBadge>
                                            </RentalInfo>
                                        </BookContent>
                                    </BookItem>
                                ))}
                            </BooksList>
                        )}
                    </ModalContent>
                </Modal>
            )}

            {showEditModal && (
                <Modal>
                    <ModalContent>
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <FormGroup>
                                <label>Name:</label>
                                <Input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Surname:</label>
                                <Input
                                    type="text"
                                    value={editFormData.surname}
                                    onChange={e => setEditFormData({...editFormData, surname: e.target.value})}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Email:</label>
                                <Input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editFormData.isAdmin}
                                        onChange={e => setEditFormData({...editFormData, isAdmin: e.target.checked})}
                                    />
                                    Administrator
                                </label>
                            </FormGroup>
                            <ButtonGroup>
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            </ButtonGroup>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default UserManagement;

const Container = styled.div`
    padding: 1rem;
`;

const UserList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
`;

const UserCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
    }
`;

const UserInfo = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
    width: 50px;
    height: 50px;
    background: #e8f5e9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2E7D32;
`;

const UserDetails = styled.div`
    flex: 1;
`;

const UserName = styled.h3`
    margin: 0;
    color: #333;
    font-size: 1.1rem;
`;

const UserEmail = styled.p`
    margin: 0.25rem 0;
    color: #666;
    font-size: 0.9rem;
`;

const BookTitle = styled.h3`
    margin: 0;
    color: #2E7D32;
    font-size: 1.4rem;
`;

const BookAuthor = styled.p`
    color: #666;
    margin: 0;
    font-size: 1.1rem;
`;

const RentalDates = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
`;

const UserRole = styled.span`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: ${props => props.isAdmin ? '#e8f5e9' : '#f5f5f5'};
    color: ${props => props.isAdmin ? '#2E7D32' : '#666'};
    border-radius: 12px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

const Actions = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    h2 {
        margin: 0;
        color: #2E7D32;
        font-size: 1.8rem;
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.8rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.2s ease;

    &:hover {
        color: #2E7D32;
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #666;
    gap: 1rem;
    
    p {
        margin: 0;
        font-size: 1.1rem;
    }
`;

const BookImageSection = styled.div`
    flex-shrink: 0;
`;

const BookContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-right: 1rem;
`;

const RentalInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const NoImageContainer = styled.div`
    width: 120px;
    height: 180px;
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 0.9rem;
    border: 1px dashed #ccc;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: ${props => props.danger ? '#ffebee' : '#e8f5e9'};
    color: ${props => props.danger ? '#c62828' : '#2E7D32'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.danger ? '#ffcdd2' : '#c8e6c9'};
    }
`;

const BooksList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-height: 600px;
    overflow-y: auto;
    padding: 1rem;
    margin: 1rem 0;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
`;

const DateInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    span:first-child {
        color: #666;
        font-size: 0.9rem;
        font-weight: 500;
    }

    span:last-child {
        color: #333;
        font-size: 1.1rem;
        font-weight: 500;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #4CAF50;
    }
`;

const BookItem = styled.div`
    display: flex;
    gap: 2.5rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
    }
`;

const BookImage = styled.img`
    width: 120px;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BookInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.span`
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.5rem;
    background: ${props => props.status === 'Overdue' ? '#ffebee' : '#e8f5e9'};
    color: ${props => props.status === 'Overdue' ? '#c62828' : '#2e7d32'};
`;
const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const Button = styled.button`
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    background: ${props => props.secondary ? '#f5f5f5' : '#4CAF50'};
    color: ${props => props.secondary ? '#666' : 'white'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.secondary ? '#eee' : '#2E7D32'};
    }
`;

const ErrorMessage = styled.div`
    color: #c62828;
    padding: 1rem;
    text-align: center;
    background: #ffebee;
    border-radius: 6px;
    margin-bottom: 1rem;
`;