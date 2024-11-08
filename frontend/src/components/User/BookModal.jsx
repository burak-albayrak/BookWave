import React, { useState } from 'react';
import styled from 'styled-components';

const BookModal = ({ book, onClose, onRent }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRent = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        await onRent(book.isbn, startDate, endDate);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <BookDetails>
                    <ImageSection>
                        {book.imageUrlLarge || book.imageUrlMedium ? (
                            <BookImage src={book.imageUrlLarge || book.imageUrlMedium} alt={book.bookTitle} />
                        ) : (
                            <NoImageContainer>No Image Available</NoImageContainer>
                        )}
                    </ImageSection>

                    <InfoSection>
                        <BookTitle>{book.bookTitle}</BookTitle>
                        <BookInfo>
                            <InfoItem><Label>Author:</Label> {book.bookAuthor}</InfoItem>
                            <InfoItem><Label>Publisher:</Label> {book.publisher}</InfoItem>
                            <InfoItem><Label>Year:</Label> {book.yearOfPublication}</InfoItem>
                            <InfoItem><Label>ISBN:</Label> {book.isbn}</InfoItem>
                            <InfoItem><Label>Status:</Label>
                                <StatusBadge available={book.isAvailable}>
                                    {book.isAvailable ? 'Available' : 'Not Available'}
                                </StatusBadge>
                            </InfoItem>
                        </BookInfo>

                        {book.isAvailable && (
                            <RentalSection>
                                <h3>Rent this Book</h3>
                                <DateInput
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    placeholder="Start Date"
                                />
                                <DateInput
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    placeholder="End Date"
                                />
                                <RentButton onClick={handleRent}>Rent Book</RentButton>
                            </RentalSection>
                        )}
                    </InfoSection>
                </BookDetails>
            </ModalContent>
        </ModalOverlay>
    );
};

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

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
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
    display: flex;
    gap: 2rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
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
`;

const Label = styled.span`
    font-weight: bold;
    color: #666;
`;

const StatusBadge = styled.span`
    background-color: ${props => props.available ? '#e8f5e9' : '#ffebee'};
    color: ${props => props.available ? '#4CAF50' : '#f44336'};
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-left: 0.5rem;
`;

const RentalSection = styled.div`
    border-top: 1px solid #e0e0e0;
    padding-top: 1rem;
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

const DateInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    font-size: 1rem;
`;

const RentButton = styled.button`
    width: 100%;
    padding: 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    margin-top: 1rem;

    &:hover {
        background-color: #45a049;
    }
`;

export default BookModal;