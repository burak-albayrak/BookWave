import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../context/UserContext';
import { API_URL } from '../../services/api';

const ProfilePage = () => {
    const { state, dispatch } = useContext(UserContext);
    const { user } = state;
    const [isEditing, setIsEditing] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [userCreditCards, setUserCreditCards] = useState([]);
    const [selectedCreditCard, setSelectedCreditCard] = useState(null);
    const [creditCard, setCreditCard] = useState(null);
    const [creditCardData, setCreditCardData] = useState({
        cardName: '',
        cardNumber: '',
        cardHolderName: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [formData, setFormData] = useState({
        name: user.name,
        surname: user.surname,
        email: user.email
    });
    const [addressData, setAddressData] = useState({
        addressName: '',
        addressLine: '',
        country: '',
        city: '',
        district: '',
        postalCode: ''
    });
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/address/user/${user.userID}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserAddresses(data);
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };
        if (user?.userID) {
            fetchAddresses();
        }
    }, [user]);

    useEffect(() => {
        const fetchCreditCards = async () => {
            try {
                const response = await fetch(`${API_URL}/api/creditcard/user/${user.userID}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserCreditCards(data);
                }
            } catch (err) {
                console.error('Error fetching credit cards:', err);
            }
        };
        if (user?.userID) {
            fetchCreditCards();
        }
    }, [user]);

    const handleCreditCardSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = selectedCreditCard
                ? `${API_URL}/api/creditcard/update/${selectedCreditCard.cardID}`
                : `${API_URL}/api/creditcard/add/${user.userID}`;

            const response = await fetch(endpoint, {
                method: selectedCreditCard ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creditCardData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save credit card');
            }

            if (selectedCreditCard) {
                setUserCreditCards(userCreditCards.map(card =>
                    card.cardID === selectedCreditCard.cardID ? data : card
                ));
            } else {
                setUserCreditCards([...userCreditCards, data]);
            }

            setShowCreditCardModal(false);
            setCreditCardData({
                cardName: '',
                cardNumber: '',
                cardHolderName: '',
                expirationMonth: '',
                expirationYear: '',
                cvv: ''
            });
            setSelectedCreditCard(null);
            alert(selectedCreditCard ? 'Credit card updated successfully' : 'Credit card added successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/change-password/${user.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            alert('Password changed successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = selectedAddress
                ? `${API_URL}/api/address/update/${selectedAddress.addressID}`
                : `${API_URL}/api/address/add/${user.userID}`;

            const response = await fetch(endpoint, {
                method: selectedAddress ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save address');
            }

            if (selectedAddress) {
                setUserAddresses(userAddresses.map(addr =>
                    addr.addressID === selectedAddress.addressID ? data : addr
                ));
            } else {
                setUserAddresses([...userAddresses, data]);
            }

            setShowAddressModal(false);
            setAddressData({
                addressName: '',
                addressLine: '',
                country: '',
                city: '',
                district: '',
                postalCode: ''
            });
            setSelectedAddress(null);
            alert(selectedAddress ? 'Address updated successfully' : 'Address added successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <ProfileCard>
                <ProfileHeader>
                    <Avatar>{user?.name?.[0]}{user?.surname?.[0]}</Avatar>
                    <UserName>{user?.name} {user?.surname}</UserName>
                    <UserRole>{user?.isAdmin ? 'Administrator' : ''}</UserRole>
                </ProfileHeader>

                <InfoSection>
                    <InfoItem>
                        <Label>Email</Label>
                        <Value>{user?.email}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>Addresses</Label>
                        {Array.isArray(userAddresses) && userAddresses.length > 0 ? (
                            userAddresses.map(address => (
                                <Value
                                    key={address.addressID}
                                    onClick={() => {
                                        setSelectedAddress(address);
                                        setAddressData(address);
                                        setShowAddressModal(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <strong>{address.addressName}</strong><br/>
                                    {address.addressLine}<br/>
                                    {address.district}, {address.city}<br/>
                                    {address.country}, {address.postalCode}
                                </Value>
                            ))
                        ) : (
                            <Value>No addresses added yet</Value>
                        )}
                    </InfoItem>
                    <InfoItem>
                        <Label>Credit Cards</Label>
                        {Array.isArray(userCreditCards) && userCreditCards.length > 0 ? (
                            userCreditCards.map(card => (
                                <Value
                                    key={card.cardID}
                                    onClick={() => {
                                        setSelectedCreditCard(card);
                                        setCreditCardData({
                                            cardName: card.cardName,
                                            cardNumber: card.cardNumber,
                                            cardHolderName: card.cardHolderName,
                                            expirationMonth: card.expirationMonth,
                                            expirationYear: card.expirationYear,
                                            cvv: ''
                                        });
                                        setShowCreditCardModal(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <strong>{card.cardName}</strong><br/>
                                    {card.cardHolderName}<br/>
                                    **** **** **** {card.cardNumber.slice(-4)}<br/>
                                    Expires: {card.expirationMonth}/{card.expirationYear}
                                </Value>
                            ))
                        ) : (
                            <Value>No credit cards added yet</Value>
                        )}
                    </InfoItem>
                        <ButtonGroup>
                            <Button onClick={() => setShowPasswordModal(true)}>
                                Change Password
                            </Button>
                            <Button onClick={() => {
                                setSelectedAddress(null);
                                setAddressData({
                                    addressName: '',
                                    addressLine: '',
                                    country: '',
                                    city: '',
                                    district: '',
                                    postalCode: ''
                                });
                                setShowAddressModal(true);
                            }}>
                                Add New Address
                            </Button>
                            <Button onClick={() => {
                                setSelectedCreditCard(null);
                                setCreditCardData({
                                    cardName: '',
                                    cardNumber: '',
                                    cardHolderName: '',
                                    expirationMonth: '',
                                    expirationYear: '',
                                    cvv: ''
                                });
                                setShowCreditCardModal(true);
                            }}>
                                Add New Card
                            </Button>
                        </ButtonGroup>
                </InfoSection>


                {showAddressModal && (
                    <>
                        <ModalOverlay onClick={() => setShowAddressModal(false)} />
                        <Modal2>
                            <ModalTitle>
                                {selectedAddress ? `Edit Address - ${selectedAddress.addressName}` : 'Add New Address'}
                            </ModalTitle>
                            <Form2 onSubmit={handleAddressSubmit}>
                                <FormGroup2>
                                    <Label>Address Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Home, Work, etc."
                                        value={addressData.addressName}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            addressName: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <FormGroup2>
                                    <Label>Country</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your country"
                                        value={addressData.country}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            country: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <FormGroup2>
                                    <Label>City</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your city"
                                        value={addressData.city}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            city: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <FormGroup2>
                                    <Label>District</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your district"
                                        value={addressData.district}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            district: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <FormGroup2>
                                    <Label>Postal Code</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter postal code"
                                        value={addressData.postalCode}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            postalCode: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <FormGroup2>
                                    <Label>Address Line</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your street address"
                                        value={addressData.addressLine}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            addressLine: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup2>
                                <ButtonGroup>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : (selectedAddress ? 'Update Address' : 'Add Address')}
                                    </Button>
                                    <Button type="button" secondary onClick={() => setShowAddressModal(false)}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                            </Form2>
                        </Modal2>
                    </>
                )}

                {showPasswordModal && (
                    <>
                        <ModalOverlay onClick={() => setShowPasswordModal(false)} />
                        <Modal>
                            <ModalTitle>Change Password</ModalTitle>
                            <Form onSubmit={handlePasswordChange}>
                                <FormGroup>
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            confirmNewPassword: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <ButtonGroup>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </Button>
                                    <Button type="button" secondary onClick={() => setShowPasswordModal(false)}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                            </Form>
                        </Modal>
                    </>
                )}

                {showCreditCardModal && (
                    <>
                        <ModalOverlay onClick={() => setShowCreditCardModal(false)} />
                        <Modal>
                            <ModalTitle>
                                {selectedCreditCard ? `Edit Credit Card - ${selectedCreditCard.cardHolderName}` : 'Add New Credit Card'}
                            </ModalTitle>
                            <Form onSubmit={handleCreditCardSubmit}>
                                <FormGroup>
                                    <Label>Card Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Personal Card, Work Card, etc."
                                        value={creditCardData.cardName}
                                        onChange={(e) => setCreditCardData({
                                            ...creditCardData,
                                            cardName: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Card Number</Label>
                                    <Input
                                        type="text"
                                        maxLength="16"
                                        value={creditCardData.cardNumber}
                                        onChange={(e) => setCreditCardData({
                                            ...creditCardData,
                                            cardNumber: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Card Holder Name</Label>
                                    <Input
                                        type="text"
                                        value={creditCardData.cardHolderName}
                                        onChange={(e) => setCreditCardData({
                                            ...creditCardData,
                                            cardHolderName: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Expiration Date</Label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Input
                                            type="number"
                                            placeholder="MM"
                                            min="1"
                                            max="12"
                                            value={creditCardData.expirationMonth}
                                            onChange={(e) => setCreditCardData({
                                                ...creditCardData,
                                                expirationMonth: e.target.value
                                            })}
                                            required
                                            style={{ width: '70px' }}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="YYYY"
                                            min={new Date().getFullYear()}
                                            max={new Date().getFullYear() + 10}
                                            value={creditCardData.expirationYear}
                                            onChange={(e) => setCreditCardData({
                                                ...creditCardData,
                                                expirationYear: e.target.value
                                            })}
                                            required
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>CVV</Label>
                                    <Input
                                        type="password"
                                        maxLength="3"
                                        value={creditCardData.cvv}
                                        onChange={(e) => setCreditCardData({
                                            ...creditCardData,
                                            cvv: e.target.value
                                        })}
                                        required
                                        style={{ width: '70px' }}
                                    />
                                </FormGroup>
                                <ButtonGroup>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Credit Card'}
                                    </Button>
                                    <Button type="button" secondary onClick={() => setShowCreditCardModal(false)}>
                                        Cancel
                                    </Button>
                                </ButtonGroup>
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                            </Form>
                        </Modal>
                    </>
                )}
            </ProfileCard>
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
`;

const ProfileCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const ProfileHeader = styled.div`
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    padding: 2rem;
    text-align: center;
    color: white;
`;

const Avatar = styled.div`
    width: 100px;
    height: 100px;
    background: white;
    color: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 1rem;
`;

const UserName = styled.h2`
    margin: 0;
    font-size: 1.5rem;
`;

const UserRole = styled.div`
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 0.5rem;
`;

const InfoSection = styled.div`
    padding: 2rem;
`;

const InfoItem = styled.div`
    margin-bottom: 1.5rem;
    background: #f8f9fa;
    padding: 1.2rem;
    border-radius: 8px;
`;

const Form = styled.form`
    padding: 2rem;
`;

const Form2 = styled.form`
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr; // Two columns
    gap: 1rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Single column on mobile
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1.2rem;
`;

const FormGroup2 = styled.div`
    margin-bottom: 1rem;
    width: 100%;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    color: #4CAF50;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const Value = styled.div`
    color: #333;
    font-size: 0.95rem;
    line-height: 1.5;
    padding: 0.5rem 0;
    border-bottom: 2px solid #e0e0e0;

    &:last-child {
        border-bottom: none;
    }
`;
const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
        border-color: #4CAF50;
        outline: none;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
        flex: 1;
    }
`;

const Button = styled.button`
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    ${props => props.secondary ? `
        background: #f5f5f5;
        color: #333;
        
        &:hover {
            background: #eee;
        }
    ` : `
        background: #4CAF50;
        color: white;
        
        &:hover {
            background: #45a049;
        }
        
        &:disabled {
            background: #9e9e9e;
            cursor: not-allowed;
        }
    `}
`;

const ErrorMessage = styled.div`
    color: #f44336;
    margin-top: 1rem;
    font-size: 0.9rem;
`;

const Modal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 500px;
    z-index: 1000;
`;

const Modal2 = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 90%;
    max-width: 800px; // Increased from default
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const ModalTitle = styled.h2`
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.5rem;
`;

export default ProfilePage;