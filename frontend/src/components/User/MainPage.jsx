import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { API_URL } from '../../services/api';
import BookModal from './BookModal';
import { UserContext } from '../../context/UserContext';
import LoadingSpinner from "../../assets/styles/LoadingSpinner";

const MainPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [sortOption, setSortOption] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const [error, setError] = useState('');
    const { state } = useContext(UserContext);
    const { user } = state;

    const handleRentBook = async (isbn, startDate, endDate, addressID, cardID) => {
        console.log('Rent attempt started with:', { isbn, startDate, endDate, addressID, cardID, userID: user?.userID });

        if (!user?.userID) {
            console.log('User context missing:', { state, user });
            const errorMsg = 'Session expired. Please log in again.';
            alert(errorMsg);
            window.location.href = '/auth';
            return;
        }

        try {
            const requestBody = {
                isbn,
                userID: user.userID,
                addressID,
                cardID,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            };
            console.log('Sending rent request with:', requestBody);

            const response = await fetch(`${API_URL}/api/book/rent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Received response:', { status: response.status, data });

            if (!response.ok) {
                throw new Error(data.message || 'Failed to rent the book');
            }

            setBooks(books.map(book =>
                book.isbn === isbn ? { ...book, isAvailable: false } : book
            ));

            alert('Book rented successfully!');
            setSelectedBook(null);
        } catch (error) {
            console.error('Rent error:', error);
            alert(error.message);
            setError(error.message);
        }
    };

    const handleSearch = async (page = 1) => {
        if (searchTerm.trim().length < 2) return;

        setLoading(true);
        setHasSearched(true);
        setDisplayedSearchTerm(searchTerm);

        try {
            let url = `${API_URL}/api/book/search/${page}?searchTerm=${encodeURIComponent(searchTerm)}`;

            if (sortOption) {
                url += `&sortOption=${sortOption}`;
            }

            if (isAvailable !== null) {
                url += `&isAvailable=${isAvailable}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setBooks(data.items);
                setTotalPages(Math.ceil(data.totalCount / data.pageSize));
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('An error occurred while searching');
        } finally {
            setLoading(false);
        }
    };

    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        const pageRange = 2; // Her yönde kaç sayfa gösterileceği
        const totalVisible = pageRange * 2 + 1;

        let startPage = Math.max(1, currentPage - pageRange);
        let endPage = Math.min(totalPages, currentPage + pageRange);

        // Sayfa aralığını dengele
        if (endPage - startPage + 1 < totalVisible) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + totalVisible - 1);
            } else {
                startPage = Math.max(1, endPage - totalVisible + 1);
            }
        }

        const pages = [];

        if (startPage > 1) {
            pages.push(
                <PageButton key={1} onClick={() => onPageChange(1)}>
                    1
                </PageButton>
            );
            if (startPage > 2) {
                pages.push(<Ellipsis key="ellipsis1">...</Ellipsis>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PageButton
                    key={i}
                    active={(currentPage === i).toString()}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </PageButton>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<Ellipsis key="ellipsis2">...</Ellipsis>);
            }
            pages.push(
                <PageButton key={totalPages} onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                </PageButton>
            );
        }

        return <PaginationContainer>{pages}</PaginationContainer>;
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
            <FilterSection>
                <Select
                    value={sortOption}
                    onChange={(e) => {
                        setSortOption(e.target.value);
                    }}
                >
                    <option value="">Sort by...</option>
                    <option value="TitleAsc">Title (A-Z)</option>
                    <option value="TitleDesc">Title (Z-A)</option>
                    <option value="RatingAsc">Rating (Low to High)</option>
                    <option value="RatingDesc">Rating (High to Low)</option>
                    <option value="AvailabilityAsc">Availability (Not Available First)</option>
                    <option value="AvailabilityDesc">Availability (Available First)</option>
                </Select>
                <FilterButton
                    active={isAvailable === true}
                    onClick={() => {
                        setIsAvailable(isAvailable === true ? null : true);
                    }}
                >
                    Available Only
                </FilterButton>
            </FilterSection>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <ResultsSection>
                    {hasSearched && books.length > 0 ? (
                        books.map((book) => (
                            <BookCard key={book.isbn} onClick={() => setSelectedBook(book)}>
                                <BookContent>
                                    {book.imageUrlMedium ? (
                                        <BookImage src={book.imageUrlMedium} alt={book.bookTitle} />
                                    ) : (
                                        <NoImageContainer>No Image Available</NoImageContainer>
                                    )}
                                    <BookInfo>
                                        <BookTitle>{book.bookTitle}</BookTitle>
                                        <BookAuthor>{book.bookAuthor}</BookAuthor>
                                        <AvailabilityBadge isAvailable={book.isAvailable}>
                                            {book.isAvailable ? 'Available' : 'Not Available'}
                                        </AvailabilityBadge>
                                        <BookRating rating={book.averageRating} />
                                    </BookInfo>
                                </BookContent>
                            </BookCard>
                        ))
                    ) : hasSearched && (
                        <NoResultsText>
                            No books found matching "{displayedSearchTerm}"
                        </NoResultsText>
                    )}
                </ResultsSection>
            )}
            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    onRent={handleRentBook}
                />
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handleSearch(page)}
                />
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

const BookInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
`;

const StatusBadge = styled.span`
    background-color: ${props => props.available === 'true' ? '#e8f5e9' : '#ffebee'};
    color: ${props => props.available === 'true' ? '#4CAF50' : '#f44336'};
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
    margin: 0.5rem auto;
    display: inline-block;
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
`;

const BookCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 200px;
    position: relative;
    transition: transform 0.2s;
    background: white;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.50);
    }
`;

const AvailabilityBadge = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: ${props => props.isAvailable ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    z-index: 1;
`;

const BookContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    color: ${props => props.filled === 'true' ? '#ffd700' : '#e0e0e0'};
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
                <StarIcon key={`full-${i}`} filled="true">&#9733;</StarIcon>
            ))}
            {hasHalfStar && <StarIcon filled="true">&#9734;</StarIcon>}
            {[...Array(emptyStars)].map((_, i) => (
                <StarIcon key={`empty-${i}`} filled="false">&#9734;</StarIcon>
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
    margin: 3rem;
    padding: 2rem;
    background-color: #e8f5e9;
    border-radius: 8px;
    border: 1px solid #4CAF50;
    width: 100%;
    max-width: 600px;
`;

const FilterSection = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    justify-content: center;
    width: 100%;
    max-width: 600px;
`;

const PaginationContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const Ellipsis = styled.span`
    color: #4CAF50;
    padding: 0 0.5rem;
`;

const Select = styled.select`
    padding: 0.5rem;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #2E7D32;
    }
`;

const FilterButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    background-color: ${props => props.active ? '#4CAF50' : 'white'};
    color: ${props => props.active ? 'white' : '#4CAF50'};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.active ? '#2E7D32' : '#e8f5e9'};
    }
`;

const PageButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    background-color: ${props => props.active === 'true' ? '#4CAF50' : 'white'};
    color: ${props => props.active === 'true' ? 'white' : '#4CAF50'};
    cursor: pointer;
    transition: all 0.2s;
    min-width: 40px;

    &:hover {
        background-color: ${props => props.active === 'true' ? '#2E7D32' : '#e8f5e9'};
    }
`;

export default MainPage;