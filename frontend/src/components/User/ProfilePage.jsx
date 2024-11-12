import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../context/UserContext';
import { API_URL } from '../../services/api';

const ProfilePage = () => {
    const { state, dispatch } = useContext(UserContext);
    const { user } = state;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        name: user.name,
        surname: user.surname,
        email: user.email,
        location: user.location || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/update-password/${user.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Password updated successfully');
        } catch (err) {
            setPasswordError('Failed to update password. Please check your current password.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/update/${user.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const updatedUser = await response.json();
            dispatch({ type: 'SET_USER', payload: updatedUser });
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <ProfileCard>
                <AvatarSection>
                    <LargeAvatar>
                        {user.name[0]}{user.surname[0]}
                    </LargeAvatar>
                    <UserName>{user.name} {user.surname}</UserName>
                </AvatarSection>

                {isEditing ? (
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Label>Name:</Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Surname:</Label>
                            <Input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Email:</Label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Location:</Label>
                            <Input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>New Password:</Label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </InputGroup>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <ButtonGroup>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Save Changes'}
                            </Button>
                            <Button type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </Form>
                ) : (
                    <>
                        <InfoSection>
                            <InfoItem>
                                <Label>Email:</Label>
                                <Value>{user.email}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Location:</Label>
                                <Value>{user.location || 'Not specified'}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Date of Birth:</Label>
                                <Value>
                                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('tr-TR') : 'Not specified'}
                                </Value>
                            </InfoItem>
                        </InfoSection>
                        <ButtonGroup>
                            <Button onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                            <Button onClick={() => setShowPasswordModal(true)}>
                                Change Password
                            </Button>
                        </ButtonGroup>
                    </>
                )}
            </ProfileCard>

            {showPasswordModal && (
                <Modal>
                    <ModalContent>
                        <ModalTitle>Change Password</ModalTitle>
                        <CloseButton onClick={() => setShowPasswordModal(false)}>×</CloseButton>
                        <Form onSubmit={handlePasswordChange}>
                            <InputGroup>
                                <Label>Current Password:</Label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>New Password:</Label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>Confirm New Password:</Label>
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                    required
                                />
                            </InputGroup>
                            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                            <Button type="submit">Update Password</Button>
                        </Form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: #4CAF50;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    
    &:hover {
        background-color: #45a049;
    }
    
    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: #f44336;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.9rem;
`;

const ProfileCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
`;

const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
`;

const LargeAvatar = styled.div`
    width: 120px;
    height: 120px;
    background-color: #4CAF50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const UserName = styled.h2`
    color: #333;
    margin: 0;
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InfoItem = styled.div`
    display: flex;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
`;

const Label = styled.span`
    font-weight: bold;
    width: 120px;
    color: #666;
`;

const Value = styled.span`
    color: #333;
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    position: relative;
`;

const ModalTitle = styled.h2`
    margin-bottom: 1.5rem;
    color: #333;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    
    &:hover {
        color: #333;
    }
`;

export default ProfilePage;