import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import { AddressModal, CreditCardModal } from '../../modals/PaymentAndAddressModals';

const BookModal = ({ book, onClose, onRent }) => {
    const { state } = useContext(UserContext);
    const { user } = state;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userCreditCards, setUserCreditCards] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const [addressData, setAddressData] = useState({
        addressName: '',
        addressLine: '',
        country: '',
        city: '',
        district: '',
        postalCode: ''
    });
    const [creditCardData, setCreditCardData] = useState({
        cardName: '',
        cardNumber: '',
        cardHolderName: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: ''
    });

    const validateDates = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return false;
        }

        if (start < today) {
            setError('Start date cannot be in the past');
            return false;
        }

        if (end <= start) {
            setError('End date must be after start date');
            return false;
        }

        const daysDifference = (end - start) / (1000 * 60 * 60 * 24);
        if (daysDifference > 30) {
            setError('Maximum rental period is 30 days');
            return false;
        }

        return true;
    };

    const handleRent = async () => {
        setError('');
        if (!validateDates()) return;
        if (!selectedAddress || !selectedCard) {
            setError('Please select both delivery address and payment method');
            return;
        }

        setLoading(true);
        try {
            await onRent(
                book.isbn,
                startDate,
                endDate,
                selectedAddress.addressID,
                selectedCard.cardID
            );
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
            const response = await fetch(`${API_URL}/api/address/add/${user.userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add address');
            }

            // Update addresses list
            const updatedAddresses = [...userAddresses, data];
            setUserAddresses(updatedAddresses);
            setSelectedAddress(data);
            setShowAddressModal(false);
            setAddressData({
                addressName: '',
                addressLine: '',
                country: '',
                city: '',
                district: '',
                postalCode: ''
            });
            alert('Address added successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreditCardSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/creditcard/add/${user.userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(creditCardData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add credit card');
            }

            // Update credit cards list
            const updatedCards = [...userCreditCards, data];
            setUserCreditCards(updatedCards);
            setSelectedCard(data);
            setShowCreditCardModal(false);
            setCreditCardData({
                cardName: '',
                cardNumber: '',
                cardHolderName: '',
                expirationMonth: '',
                expirationYear: '',
                cvv: ''
            });
            alert('Credit card added successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [addressesRes, cardsRes] = await Promise.all([
                    fetch(`${API_URL}/api/address/user/${user.userID}`),
                    fetch(`${API_URL}/api/creditcard/user/${user.userID}`)
                ]);

                if (addressesRes.ok && cardsRes.ok) {
                    const addresses = await addressesRes.json();
                    const cards = await cardsRes.json();
                    setUserAddresses(addresses);
                    setUserCreditCards(cards);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data');
            }
        };

        if (user?.userID) {
            fetchUserData();
        }
    }, [user?.userID]);

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <BookDetails>
                    <ImageSection>
                        {book.imageUrlLarge || book.imageUrlMedium ? (
                            <BookImage
                                src={book.imageUrlLarge || book.imageUrlMedium}
                                alt={book.bookTitle}
                            />
                        ) : (
                            <NoImageContainer>No Image Available</NoImageContainer>
                        )}
                        <RatingDisplay rating={book.averageRating} />
                    </ImageSection>

                    <InfoSection>
                        <BookTitle>{book.bookTitle}</BookTitle>
                        <BookInfo>
                            <InfoItem>
                                <Label>Author:</Label>
                                {book.bookAuthor}
                            </InfoItem>
                            <InfoItem>
                                <Label>Publisher:</Label>
                                {book.publisher}
                            </InfoItem>
                            <InfoItem>
                                <Label>Year:</Label>
                                {book.yearOfPublication}
                            </InfoItem>
                            <InfoItem>
                                <Label>ISBN:</Label>
                                {book.isbn}
                            </InfoItem>
                            <InfoItem>
                                <Label>Status:</Label>
                                <StatusBadge available={book.isAvailable.toString()}>
                                    {book.isAvailable ? 'Available' : 'Not Available'}
                                </StatusBadge>
                            </InfoItem>
                        </BookInfo>
                    </InfoSection>

                    {book.isAvailable && (
                            <RentalSection>
                                <h3>Rent this Book</h3>
                                <FormGroup>
                                    <Label>Start Date</Label>
                                    <DateInput
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>End Date</Label>
                                    <DateInput
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Delivery Address</Label>
                                    <Select
                                        value={selectedAddress?.addressID || ''}
                                        onChange={(e) => {
                                            const address = userAddresses.find(a => a.addressID === parseInt(e.target.value));
                                            setSelectedAddress(address);
                                        }}
                                    >
                                        <option value="">Select delivery address</option>
                                        {userAddresses.map(address => (
                                            <option key={address.addressID} value={address.addressID}>
                                                {address.addressName} - {address.city}, {address.district}
                                            </option>
                                        ))}
                                    </Select>
                                    <AddNewButton onClick={() => setShowAddressModal(true)}>
                                        + Add New Address
                                    </AddNewButton>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Payment Method</Label>
                                    <Select
                                        value={selectedCard?.cardID || ''}
                                        onChange={(e) => {
                                            const card = userCreditCards.find(c => c.cardID === parseInt(e.target.value));
                                            setSelectedCard(card);
                                        }}
                                    >
                                        <option value="">Select payment method</option>
                                        {userCreditCards.map(card => (
                                            <option key={card.cardID} value={card.cardID}>
                                                {card.cardName} - **** {card.cardNumber.slice(-4)}
                                            </option>
                                        ))}
                                    </Select>
                                    <AddNewButton onClick={() => setShowCreditCardModal(true)}>
                                        + Add New Card
                                    </AddNewButton>
                                </FormGroup>

                                {error && (
                                    <ErrorMessage>
                                        <ErrorIcon>⚠️</ErrorIcon>
                                        {error}
                                    </ErrorMessage>
                                )}

                                <RentButton
                                    onClick={handleRent}
                                    disabled={loading || !startDate || !endDate || !selectedAddress || !selectedCard}
                                >
                                    {loading ? 'Processing...' : 'Rent Book'}
                                </RentButton>
                            </RentalSection>
                        )}
                </BookDetails>
            </ModalContent>
            <AddressModal
                show={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                addressData={addressData}
                setAddressData={setAddressData}
                onSubmit={handleAddressSubmit}
                loading={loading}
            />

            <CreditCardModal
                show={showCreditCardModal}
                onClose={() => setShowCreditCardModal(false)}
                creditCardData={creditCardData}
                setCreditCardData={setCreditCardData}
                onSubmit={handleCreditCardSubmit}
                loading={loading}
            />
        </ModalOverlay>
    );
};

const RatingDisplay = ({ rating }) => {
    if (!rating || rating === 0) return null;

    return (
        <RatingContainer>
            <StarContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} filled={(star <= Math.round(rating)).toString()}>
                        ★
                    </Star>
                ))}
            </StarContainer>
            <RatingText>({rating.toFixed(1)})</RatingText>
        </RatingContainer>
    );
};

const RatingContainer = styled.div`
    margin-top: 1rem;
    text-align: center;
`;

const StarContainer = styled.div`
    display: inline-flex;
    gap: 2px;
`;

const Star = styled.span`
    color: ${props => props.filled ? '#ffc107' : '#e4e5e9'};
    font-size: 1.2rem;
`;

const RatingText = styled.span`
    margin-left: 0.5rem;
    color: #666;
    font-size: 0.9rem;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ErrorMessage = styled.div`
    grid-column: 1 / -1;
    color: #d32f2f;
    margin: 8px 0;
    padding: 1rem;
    background-color: #ffebee;
    border-radius: 8px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    border: 1px solid #ef5350;
`;

const ErrorIcon = styled.span`
    margin-right: 8px;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    max-width: 1200px;  
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
`;

const BookDetails = styled.div`
    display: grid;
    grid-template-columns: 300px 1fr 400px;
    gap: 2rem;
    margin-top: 1rem;

    @media (max-width: 1200px) {
        grid-template-columns: 300px 1fr;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ImageSection = styled.div`
    flex: 0 0 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const InfoSection = styled.div`
    flex: 1;
    padding-right: 2rem;
    border-right: 1px solid #e0e0e0;

    @media (max-width: 1200px) {
        border-right: none;
        padding-right: 0;
    }
`;

const BookImage = styled.img`
    width: 300px;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
`;

const LargeBookImage = styled.img`
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 8px;
    margin-bottom: 1rem;
`;

const BookTitle = styled.h2`
    color: #333;
    margin-bottom: 1rem;
`;

const BookInfo = styled.div`
    margin-bottom: 2rem;
`;

const InfoItem = styled.p`
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: #333;
    display: flex;
    align-items: center;
`;

const Label = styled.span`
    font-weight: 600;
    margin-right: 0.75rem;
    min-width: 80px;
`;

const StatusBadge = styled.span`
    background-color: ${props => props.available === 'true' ? '#e8f5e9' : '#ffebee'};
    color: ${props => props.available === 'true' ? '#4CAF50' : '#f44336'};
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-left: 0.5rem;
`;

const RentalSection = styled.div`
    padding: 1.5rem;
    background: #f8f8f8;
    border-radius: 12px;
    height: fit-content;

    h3 {
        color: #2E7D32;
        font-size: 1.4rem;
        margin-bottom: 1.5rem;
    }

    @media (max-width: 1200px) {
        grid-column: 1 / -1;
        margin-top: 2rem;
    }
`;

const NoImageContainer = styled.div`
    width: 300px;
    height: 400px;
    background-color: #f5f5f5;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 0.9rem;
    text-align: center;
    padding: 0 10px;
`;

const AddNewButton = styled.button`
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: transparent;
    color: #4CAF50;
    border: 1px dashed #4CAF50;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(76, 175, 80, 0.1);
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #2E7D32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const DateInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #2E7D32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
`;

const RentButton = styled.button`
    grid-column: 1 / -1;
    padding: 1rem;
    background-color: ${props => props.disabled ? '#cccccc' : '#4CAF50'};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-size: 1.1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
    margin-top: 1rem;

    &:hover {
        background-color: ${props => props.disabled ? '#cccccc' : '#2E7D32'};
    }
`;

export default BookModal;