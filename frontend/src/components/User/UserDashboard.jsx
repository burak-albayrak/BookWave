import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styled from 'styled-components';
import { API_URL } from '../../services/api';
import LoadingSpinner from "../../assets/styles/LoadingSpinner";
import {ModalOverlay} from "../../modals/PaymentAndAddressModals";

const UserDashboard = () => {
    const { state: { user } } = useContext(UserContext);
    const [currentBooks, setCurrentBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedBookForRating, setSelectedBookForRating] = useState(null);
    const [rating, setRating] = useState(0);
    const [bookRatings, setBookRatings] = useState(() => {
        const savedRatings = localStorage.getItem(`userRatings_${user?.userID}`);
        return savedRatings ? JSON.parse(savedRatings) : {};
    });

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

    const submitRating = () => {
        const newRatings = {
            ...bookRatings,
            [selectedBookForRating]: rating
        };
        setBookRatings(newRatings);
        localStorage.setItem(`userRatings_${user?.userID}`, JSON.stringify(newRatings));
        setShowRatingModal(false);
        setSelectedBookForRating(null);
        alert('Rating submitted successfully!');
    };


    useEffect(() => {
        const fetchUserBooks = async () => {
            if (!user?.userID) return;

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

        fetchUserBooks();
    }, [user]);

    return (
        <Container>
            <Title>My Books</Title>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
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

const RatingText = styled.span`
    margin-left: 0.5rem;
    color: #666;
    font-size: 0.9rem;
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

const RatingLabel = styled.span`
    color: #666;
    font-size: 1rem;
    margin-right: 0.5rem;
    font-weight: 500;
`;

const BookList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
`;

const RatingStars = styled.div`
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
`;

const StarButton = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: ${props => props.filled ? '#ffc107' : '#e4e5e9'};

    &:hover {
        color: #ffc107;
    }
`;

const RemainingDays = styled.div`
    margin-left: auto;
    padding: 0.5rem 1rem;
    background: ${props => props.days <= 3 ? '#ffebee' : '#e8f5e9'};
    color: ${props => props.days <= 3 ? '#c62828' : '#2E7D32'};
    border-radius: 6px;
    font-weight: 500;
`;

const BookListItem = styled.div`
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.50);
    }
`;

const InfoSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
`;

const DateInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    span:first-child {
        color: #666;
        font-size: 0.9rem;
    }

    span:last-child {
        color: #333;
        font-weight: 500;
    }
`;

const StyledModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const DeliveryInfo = styled.div`
    background: #f8f8f8;
    padding: 1rem;
    border-radius: 8px;

    h4 {
        color: #333;
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }

    p {
        margin: 0.25rem 0;
        color: #666;
    }
`;

const PaymentInfo = styled(DeliveryInfo)`
    background: #f0f7f0;
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: #f44336;
    font-size: 1.1rem;
    margin: 2rem 0;
`;

export default UserDashboard;

const RatingModal = ({ onClose, onSubmit, rating, setRating }) => (
    <>
        <ModalOverlay onClick={onClose} />
        <StyledModal>
            <h3>Rate this Book</h3>
            <RatingStars>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarButton
                        key={star}
                        onClick={() => setRating(star)}
                        filled={star <= rating}
                    >
                        ★
                    </StarButton>
                ))}
            </RatingStars>
        </StyledModal>
    </>
);

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