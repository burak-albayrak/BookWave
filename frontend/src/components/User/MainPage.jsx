import React, { useState } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../services/api';

const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (page = 1) => {
        if (searchTerm.trim().length < 2) return;

        setLoading(true);
        setHasSearched(true);
        setDisplayedSearchTerm(searchTerm);
        try {
            const response = await fetch(
                `${API_URL}/api/book/search/${page}?searchTerm=${encodeURIComponent(searchTerm)}`
            );
            const data = await response.json();

            if (response.ok) {
                setBooks(data.items);
                setTotalPages(Math.ceil(data.totalCount / data.pageSize));
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Logo src="/logo.png" alt="BookWave Logo" />

            <SearchSection>
                <SearchBar
                    type="text"
                    placeholder="Search for books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                />
                <SearchButton onClick={() => handleSearch(1)}>
                    Search
                </SearchButton>
            </SearchSection>

            {loading ? (
                <LoadingText>Loading...</LoadingText>
            ) : (
                <ResultsSection>
                    {hasSearched && books.length === 0 ? (
                        <NoResultsText>
                            No books found matching "{displayedSearchTerm}"
                        </NoResultsText>
                    ) : (
                        books.map((book) => (
                            <BookCard key={book.isbn}>
                                <BookContent>
                                    {book.imageUrlMedium ? (
                                        <BookImage src={book.imageUrlMedium} alt={book.bookTitle} />
                                    ) : (
                                        <NoImageContainer>No Image Available</NoImageContainer>
                                    )}
                                    <BookTitle>{book.bookTitle}</BookTitle>
                                    <BookAuthor>{book.bookAuthor}</BookAuthor>
                                </BookContent>
                                <BookRating rating={book.averageRating} />
                            </BookCard>
                        ))
                    )}
                </ResultsSection>
            )}

            {totalPages > 1 && (
                <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PageButton
                            key={i + 1}
                            active={currentPage === i + 1}
                            onClick={() => handleSearch(i + 1)}
                        >
                            {i + 1}
                        </PageButton>
                    ))}
                </Pagination>
            )}
        </Container>
    );
};

// Styled components
const Container = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 2rem;
    border-radius: 50%;
    object-fit: cover;
`;

const SearchSection = styled.div`
    width: 100%;
    max-width: 600px;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const SearchBar = styled.input`
    flex: 1;
    padding: 1rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;
    
    &:focus {
        outline: none;
        border-color: #2E7D32;
    }
`;

const SearchButton = styled.button`
    padding: 1rem 2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
        background-color: #2E7D32;
    }
`;

const ResultsSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
`;

const BookCard = styled.div`
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.2s;
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
        transform: translateY(-5px);
    }
`;

const BookContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const BookImage = styled.img`
    width: 150px;
    height: 200px;
    margin: 0 auto 1rem auto;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    padding-top: 1rem;
    gap: 0.25rem;
`;

const StarIcon = styled.span`
    color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
    font-size: 1.2rem;
`;

const RatingText = styled.span`
font-size: 0.9rem;
color: #666;
margin-left: 0.5rem;
`;

const NoImageContainer = styled.div`
    width: 150px;
    height: 200px;
    margin: 0 auto 1rem auto;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 0.9rem;
    text-align: center;
    padding: 0 10px;
`;

const BookRating = ({ rating }) => {
    if (!rating || rating < 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
        <RatingContainer>
            {[...Array(Math.min(5, fullStars))].map((_, i) => (
                <StarIcon key={`full-${i}`} filled>&#9733;</StarIcon>
            ))}
            {hasHalfStar && <StarIcon filled>&#9734;</StarIcon>}
            {[...Array(emptyStars)].map((_, i) => (
                <StarIcon key={`empty-${i}`}>&#9734;</StarIcon>
            ))}
            <RatingText>({rating.toFixed(1)})</RatingText>
        </RatingContainer>
    );
};

const BookTitle = styled.h3`
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #333;
`;

const BookAuthor = styled.p`
    font-size: 0.9rem;
    color: #666;
`;

const Pagination = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 2rem;
`;

const NoResultsText = styled.p`
    text-align: center;
    color: #4CAF50;
    font-size: 1.2rem;
    margin: 3rem auto;
    padding: 2rem;
    background-color: #e8f5e9;
    border-radius: 8px;
    border: 1px solid #4CAF50;
    width: 100%;
    max-width: 600px;
`;

const PageButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #4CAF50;
    background-color: ${props => props.active ? '#4CAF50' : 'white'};
    color: ${props => props.active ? 'white' : '#4CAF50'};
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.active ? '#2E7D32' : '#e8f5e9'};
    }
`;

const LoadingText = styled.p`
    color: #666;
    font-size: 1.1rem;
    margin: 2rem 0;
`;

export default MainPage;