import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styled from 'styled-components';
import { API_URL } from '../../services/api';
import LoadingSpinner from "../../assets/styles/LoadingSpinner";
import {ModalOverlay} from "../../modals/PaymentAndAddressModals";
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const context = useContext(UserContext);
    const [currentBooks, setCurrentBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedBookForRating, setSelectedBookForRating] = useState(null);
    const [rating, setRating] = useState(0);
    const [bookRatings, setBookRatings] = useState({});

    const user = context?.state?.user;

    useEffect(() => {
        if (user?.userID) {
            try {
                const savedRatings = localStorage.getItem(`userRatings_${user.userID}`);
                if (savedRatings) {
                    setBookRatings(JSON.parse(savedRatings));
                }
            } catch (error) {
                console.error('Error loading ratings:', error);
            }
        }
    }, [user]);

    const fetchUserBooks = async () => {
        if (!user?.userID) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/book/user/${user.userID}/books`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setCurrentBooks(data);
        } catch (err) {
            setError('Failed to load your books');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserBooks();
    }, [user]);

    if (!context || loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <ErrorMessage>Please log in to view your books.</ErrorMessage>;
    }

    const handleRateBook = (isbn) => {
        setSelectedBookForRating(isbn);
        setRating(bookRatings[isbn] || 0);
        setShowRatingModal(true);
    };

    const calculateRemainingDays = (endDate) => {
        const today = new Date();
        const due = new Date(endDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const submitRating = async () => {
        if (!user?.userID || !selectedBookForRating) {
            toast.error('Unable to update rating. Please try again.');
            return;
        }

        try {
            const newRatings = {
                ...bookRatings,
                [selectedBookForRating]: rating
            };
            setBookRatings(newRatings);
            localStorage.setItem(`userRatings_${user.userID}`, JSON.stringify(newRatings));

            toast.success('Rating updated successfully!');
            setShowRatingModal(false);
            setSelectedBookForRating(null);
        } catch (error) {
            console.error('Error updating rating:', error);
            toast.error('Failed to update rating. Please try again.');
        }
    };

    return (
        <Container>
            <Title>My Books</Title>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : currentBooks.length === 0 ? (
                <EmptyStateContainer>
                    <EmptyStateIcon>📚</EmptyStateIcon>
                    <EmptyStateTitle>No Books Yet</EmptyStateTitle>
                    <EmptyStateText>
                        You haven't rented any books yet.
                        Browse our collection and start your reading journey!
                    </EmptyStateText>
                    <BrowseBooksButton onClick={() => window.location.href = './main'}>
                        Browse Books
                    </BrowseBooksButton>
                </EmptyStateContainer>
            ) : (
                <BookList>
                    {currentBooks.map((book) => (
                        <BookListItem key={book.isbn}>
                            <BookImage src={book.imageUrlMedium || book.imageUrlSmall} alt={book.bookTitle} />
                            <BookDetails>
                                <BookInfo>
                                    <BookTitle>{book.bookTitle}</BookTitle>
                                    <BookAuthor>{book.bookAuthor}</BookAuthor>
                                </BookInfo>

                                <RentalDates>
                                    <DateInfo>
                                        <span>Start Date</span>
                                        <span>{new Date(book.startDate).toLocaleDateString()}</span>
                                    </DateInfo>
                                    <DateInfo>
                                        <span>Due Date</span>
                                        <span>{new Date(book.endDate).toLocaleDateString()}</span>
                                    </DateInfo>
                                    <RemainingDays days={calculateRemainingDays(book.endDate)}>
                                        {calculateRemainingDays(book.endDate)} days remaining
                                    </RemainingDays>
                                </RentalDates>

                                <InfoSection>
                                    <DeliveryInfo>
                                        <h4>Delivery Address</h4>
                                        <p><strong>{book.addressName}</strong></p>
                                        <p>{book.addressLine}</p>
                                        <p>{book.district}, {book.city}</p>
                                    </DeliveryInfo>

                                    <PaymentInfo>
                                        <h4>Payment Method</h4>
                                        <p><strong>{book.cardName}</strong></p>
                                        <p>{book.cardHolderName}</p>
                                        <p>**** **** **** {book.cardNumber}</p>
                                    </PaymentInfo>
                                </InfoSection>

                                <RatingContainer style={{ marginTop: '1rem' }}>
                                    {bookRatings[book.isbn] ? (
                                        <>
                                            <BookRating rating={bookRatings[book.isbn]} />
                                            <RateButton onClick={() => handleRateBook(book.isbn)}>
                                                Update Rating
                                            </RateButton>
                                        </>
                                    ) : (
                                        <RateButton onClick={() => handleRateBook(book.isbn)}>
                                            Rate This Book
                                        </RateButton>
                                    )}
                                </RatingContainer>
                            </BookDetails>
                        </BookListItem>
                    ))}
                </BookList>
            )}

            {showRatingModal && (
                <RatingModal
                    onClose={() => setShowRatingModal(false)}
                    onSubmit={submitRating}
                    rating={rating}
                    setRating={setRating}
                />
            )}
        </Container>
    );
};

const RatingContainer = styled.div`
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
`;


const Star = styled.span`
    color: ${props => props.filled === 'true' ? '#ffc107' : '#e4e5e9'};
    font-size: 1.2rem;
`;

const RatingText = styled.div`
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 0.5rem;
`;

const Container = styled.div`
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
`;

const Title = styled.h2`
    color: #4CAF50;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 1rem;

    &:after {
        content: '';
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 3px;
        background: linear-gradient(to right, #4CAF50, #81c784);
        border-radius: 2px;
    }
`;

const BookList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;

    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

const RateButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 1rem;
    width: fit-content;

    &:hover {
        background-color: #2E7D32;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
    }

    &:active {
        transform: translateY(0);
        box-shadow: none;
    }
`;

const BookImage = styled.img`
    width: 140px;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        width: 120px;
        height: 180px;
        margin: 0 auto;
    }
`;

const BookInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const BookDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    background: linear-gradient(to right, #f8f9fa, #ffffff);
    padding: 1.2rem;
    border-radius: 12px;
    border: 1px solid #e0e0e0;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
`;

const RatingStars = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.5rem 0;
`;

const StarButton = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    color: ${props => props.filled ? '#ffc107' : '#e4e5e9'};
    cursor: pointer;
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        transform: scale(1.2);
        color: #ffc107;
    }
`;

const RemainingDays = styled.div`
    margin-left: auto;
    padding: 0.75rem 1.25rem;
    background: ${props => {
        if (props.days <= 3) return '#ffebee';
        if (props.days <= 7) return '#fff3e0';
        return '#e8f5e9';
    }};
    color: ${props => {
        if (props.days <= 3) return '#c62828';
        if (props.days <= 7) return '#ef6c00';
        return '#2E7D32';
    }};
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:before {
        content: '⏰';
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        margin: 0;
        width: 100%;
        justify-content: center;
    }
`;

const BookListItem = styled.div`
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: #4CAF50;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(76, 175, 80, 0.15);

        &:before {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
    }
`;

const InfoSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;


const DateInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    span:first-child {
        color: #666;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    span:last-child {
        color: #2E7D32;
        font-weight: 600;
        font-size: 1.1rem;
    }
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    background: #f8f9fa;
    border-radius: 12px;
    margin: 2rem auto;
    max-width: 600px;
`;

const EmptyStateIcon = styled.div`
    font-size: 4rem;
    margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
    color: #2E7D32;
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
`;

const BrowseBooksButton = styled.button`
    background-color: #2E7D32;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #1B5E20;
    }
`;

const DeliveryInfo = styled.div`
    background: #f8f8f8;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }

    h4 {
        color: #2E7D32;
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    p {
        margin: 0.5rem 0;
        color: #555;
        line-height: 1.5;
    }
`;

const PaymentInfo = styled(DeliveryInfo)`
    background: #f0f7f0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
        margin: 0;
        color: #2E7D32;
        font-size: 1.4rem;
    }
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: #f44336;
    font-size: 1.1rem;
    margin: 2rem 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    
    &:hover {
        color: #333;
    }
`;

const BaseButton = styled.button`
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
`;

const CancelButton = styled(BaseButton)`
    background: #f5f5f5;
    color: #666;

    &:hover {
        background: #eeeeee;
    }
`;

const SubmitButton = styled(BaseButton)`
    background: #4CAF50;
    color: white;

    &:hover {
        background: #2E7D32;
        transform: translateY(-2px);
    }

    &:disabled {
        background: #cccccc;
        cursor: not-allowed;
        transform: none;
    }
`;

export default UserDashboard;

const RatingModal = ({ onClose, onSubmit, rating, setRating }) => {
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Rate This Book</h3>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>

                <RatingStars>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarButton
                            key={star}
                            onClick={() => setRating(star)}
                            filled={star <= rating}
                            type="button"
                        >
                            ★
                        </StarButton>
                    ))}
                </RatingStars>

                <RatingText>
                    {rating === 0 ? 'Select your rating' : `Your rating: ${rating} star${rating !== 1 ? 's' : ''}`}
                </RatingText>

                <ButtonGroup>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <SubmitButton onClick={onSubmit} disabled={rating === 0}>
                        Submit Rating
                    </SubmitButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

const BookRating = ({ rating }) => {
    return (
        <RatingContainer>
            <RatingText>Your Rating: </RatingText>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} filled={(star <= rating).toString()}>★</Star>
            ))}
        </RatingContainer>
    );
};