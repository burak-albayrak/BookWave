import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaSearch, FaUser, FaCalendar, FaBuilding } from 'react-icons/fa';
import { API_URL } from '../../services/api';
import LoadingSpinner from '../../assets/styles/LoadingSpinner';
import Pagination from '../../assets/styles/Pagination';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        bookTitle: '',
        bookAuthor: '',
        yearOfPublication: '',
        publisher: '',
        imageUrlSmall: '',
        imageUrlMedium: '',
        imageUrlLarge: '',
        isAvailable: true
    });

    const handleSearch = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/books?page=${page}&searchTerm=${searchTerm}`);
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setEditFormData({
            bookTitle: book.bookTitle,
            bookAuthor: book.bookAuthor,
            yearOfPublication: book.yearOfPublication,
            publisher: book.publisher,
            imageUrlSmall: book.imageUrlSmall,
            imageUrlMedium: book.imageUrlMedium,
            imageUrlLarge: book.imageUrlLarge,
            isAvailable: book.isAvailable
        });
        setShowEditModal(true);
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/books/${selectedBook.isbn}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });
            if (!response.ok) throw new Error('Failed to update book');
            handleSearch(currentPage);
            setShowEditModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteBook = async (isbn) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/books/${isbn}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete book');
            handleSearch(currentPage);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container>
            <SearchSection>
                <SearchBar>
                    <SearchInput
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchButton onClick={() => handleSearch(1)}>
                        <FaSearch />
                    </SearchButton>
                </SearchBar>
            </SearchSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <BookGrid>
                    {books.map((book) => (
                        <BookCard key={book.isbn}>
                            <BookImageContainer>
                                {book.imageUrlMedium ? (
                                    <BookImage src={book.imageUrlMedium} alt={book.bookTitle} />
                                ) : (
                                    <NoImageContainer>No Image</NoImageContainer>
                                )}
                            </BookImageContainer>

                            <BookContent>
                                <BookInfo>
                                    <BookTitle>{book.bookTitle}</BookTitle>
                                    <BookDetail>
                                        <FaUser /> {book.bookAuthor}
                                    </BookDetail>
                                    <BookDetail>
                                        <FaCalendar /> {book.yearOfPublication}
                                    </BookDetail>
                                    <BookDetail>
                                        <FaBuilding /> {book.publisher}
                                    </BookDetail>
                                </BookInfo>

                                <Actions>
                                    <ActionButton onClick={() => handleEditBook(book)}>
                                        <FaEdit /> Edit
                                    </ActionButton>
                                    <ActionButton danger onClick={() => handleDeleteBook(book.isbn)}>
                                        <FaTrash /> Delete
                                    </ActionButton>
                                </Actions>
                            </BookContent>
                        </BookCard>
                    ))}
                </BookGrid>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handleSearch}
                />
            )}

            {showEditModal && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Edit Book</h2>
                            <CloseButton onClick={() => setShowEditModal(false)}>&times;</CloseButton>
                        </ModalHeader>
                        <form onSubmit={handleUpdateBook}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>Title</Label>
                                    <Input
                                        type="text"
                                        value={editFormData.bookTitle}
                                        onChange={e => setEditFormData({...editFormData, bookTitle: e.target.value})}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Author</Label>
                                    <Input
                                        type="text"
                                        value={editFormData.bookAuthor}
                                        onChange={e => setEditFormData({...editFormData, bookAuthor: e.target.value})}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Year of Publication</Label>
                                    <Input
                                        type="number"
                                        value={editFormData.yearOfPublication}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            yearOfPublication: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Publisher</Label>
                                    <Input
                                        type="text"
                                        value={editFormData.publisher}
                                        onChange={e => setEditFormData({...editFormData, publisher: e.target.value})}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Small Image URL</Label>
                                    <Input
                                        type="url"
                                        value={editFormData.imageUrlSmall}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            imageUrlSmall: e.target.value
                                        })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Medium Image URL</Label>
                                    <Input
                                        type="url"
                                        value={editFormData.imageUrlMedium}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            imageUrlMedium: e.target.value
                                        })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Large Image URL</Label>
                                    <Input
                                        type="url"
                                        value={editFormData.imageUrlLarge}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            imageUrlLarge: e.target.value
                                        })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Availability</Label>
                                    <Select
                                        value={editFormData.isAvailable}
                                        onChange={e => setEditFormData({
                                            ...editFormData,
                                            isAvailable: e.target.value === 'true'
                                        })}
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Not Available</option>
                                    </Select>
                                </FormGroup>
                            </FormGrid>
                            <ButtonGroup>
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" secondary onClick={() => setShowEditModal(false)}>Cancel</Button>
                            </ButtonGroup>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default BookManagement;

const Container = styled.div`
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const SearchSection = styled.div`
    margin-bottom: 2rem;
`;

const SearchBar = styled.div`
    display: flex;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #2E7D32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
`;

const SearchButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #2E7D32;
    }
`;

const BookCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    display: flex;
    gap: 2rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1.5rem;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;

    &:focus {
        outline: none;
        border-color: #2E7D32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
`;

const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;

    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
`;

const BookImageContainer = styled.div`
    flex: 0 0 140px;
`;

const BookImage = styled.img`
    width: 140px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

const BookContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0; 
`;

const BookInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const BookTitle = styled.h3`
    color: #2E7D32;
    font-size: 1.3rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Actions = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const ErrorMessage = styled.div`
    color: #c62828;
    padding: 1rem;
    text-align: center;
    background: #ffebee;
    border-radius: 6px;
    margin-bottom: 1rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
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

const BookDetail = styled.p`
    margin: 0;
    color: #666;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 1000px;
    max-height: 100vh;
    overflow-y: auto;
    position: relative;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #4CAF50;
        border-radius: 4px;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;

    h2 {
        color: #2E7D32;
        margin: 0;
    }
`;
const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;

    &:hover {
        color: #2E7D32;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #4CAF50;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #2E7D32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #e0e0e0;
`;

const Button = styled.button`
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    background: ${props => props.secondary ? '#f5f5f5' : '#4CAF50'};
    color: ${props => props.secondary ? '#333' : 'white'};

    &:hover {
        background: ${props => props.secondary ? '#e0e0e0' : '#2E7D32'};
        transform: translateY(-1px);
    }
`;