import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import styled from 'styled-components';
import { API_URL } from '../../services/api';

const UserDashboard = () => {
    const { state } = useContext(UserContext);
    const { user } = state;
    const [currentBooks, setCurrentBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const calculateRemainingDays = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <Container>
            <Title>My Books</Title>
            {loading ? (
                <LoadingMessage>Loading your books...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : currentBooks.length > 0 ? (
                <BookList>
                    {currentBooks.map((book) => {
                        const remainingDays = calculateRemainingDays(book.endDate);
                        return (
                            <BookListItem key={book.isbn}>
                                <BookImage
                                    src={book.imageUrlSmall || '/placeholder-book.png'}
                                    alt={book.bookTitle}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-book.png';
                                    }}
                                />
                                <BookDetails>
                                    <BookTitle>{book.bookTitle}</BookTitle>
                                    <BookAuthor>by {book.bookAuthor}</BookAuthor>
                                    <BookInfo>
                                        <InfoLabel>Publisher:</InfoLabel> {book.publisher}
                                    </BookInfo>
                                    <RentalInfo>
                                        <RentalDates>
                                            <InfoLabel>Rental Period:</InfoLabel>
                                            {new Date(book.startDate).toLocaleDateString()} - {new Date(book.endDate).toLocaleDateString()}
                                        </RentalDates>
                                        <RemainingDays status={remainingDays <= 3 ? 'warning' : 'normal'}>
                                            {remainingDays} days remaining
                                        </RemainingDays>
                                    </RentalInfo>
                                </BookDetails>
                            </BookListItem>
                        );
                    })}
                </BookList>
            ) : (
                <EmptyMessage>You don't have any books currently borrowed.</EmptyMessage>
            )}
        </Container>
    );
};

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
    gap: 1rem;
`;

const BookListItem = styled.div`
    display: flex;
    background: linear-gradient(to right, #f8fff8, white);
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(76, 175, 80, 0.1);
    padding: 1rem;
    gap: 1.5rem;
    border: 1px solid rgba(76, 175, 80, 0.1);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.15);
    }
`;

const BookImage = styled.img`
    width: 100px;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
`;

const BookDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const BookTitle = styled.h3`
    margin: 0;
    color: #333;
    font-size: 1.2rem;
`;

const BookAuthor = styled.p`
    color: #666;
    margin: 0.25rem 0;
    font-style: italic;
`;

const BookInfo = styled.p`
    margin: 0.25rem 0;
    font-size: 0.9rem;
`;

const RentalInfo = styled.div`
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const RentalDates = styled.div`
    font-size: 0.9rem;
`;

const RemainingDays = styled.div`
    color: ${props => props.status === 'warning' ? '#f44336' : '#4CAF50'};
    font-weight: bold;
    font-size: 0.9rem;
`;

const InfoLabel = styled.span`
    font-weight: bold;
    color: #555;
    margin-right: 0.5rem;
`;

const LoadingMessage = styled.p`
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin: 2rem 0;
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: #f44336;
    font-size: 1.1rem;
    margin: 2rem 0;
`;

const EmptyMessage = styled.p`
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin: 2rem 0;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 8px;
`;

export default UserDashboard;