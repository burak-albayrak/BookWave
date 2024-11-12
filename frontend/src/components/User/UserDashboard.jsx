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

    return (
        <Container>
            <Title>My Books</Title>
            {loading ? (
                <LoadingMessage>Loading your books...</LoadingMessage>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : currentBooks.length > 0 ? (
                <BookGrid>
                    {currentBooks.map((book) => (
                        <BookCard key={book.isbn}>
                            <BookImage
                                src={book.imageUrlMedium || '/placeholder-book.png'}
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
                                <BookInfo>
                                    <InfoLabel>Year:</InfoLabel> {book.yearOfPublication}
                                </BookInfo>
                            </BookDetails>
                        </BookCard>
                    ))}
                </BookGrid>
            ) : (
                <EmptyMessage>You don't have any books currently borrowed.</EmptyMessage>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h2`
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
`;

const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem;
`;

const BookCard = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const BookImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`;

const BookDetails = styled.div`
    padding: 1rem;
`;

const BookTitle = styled.h3`
    margin: 0;
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const BookAuthor = styled.p`
    color: #666;
    margin: 0 0 1rem 0;
    font-style: italic;
`;

const BookInfo = styled.p`
    margin: 0.5rem 0;
    font-size: 0.9rem;
`;

const InfoLabel = styled.span`
    font-weight: bold;
    color: #555;
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