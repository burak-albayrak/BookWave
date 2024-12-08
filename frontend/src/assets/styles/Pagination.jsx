import React from 'react';
import styled from 'styled-components';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageRange = 2;
    const totalVisible = pageRange * 2 + 1;

    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

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

const PaginationContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const PageButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    background-color: ${props => props.active === 'true' ? '#4CAF50' : 'white'};
    color: ${props => props.active === 'true' ? 'white' : '#4CAF50'};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.active === 'true' ? '#2E7D32' : '#e8f5e9'};
    }
`;

const Ellipsis = styled.span`
    color: #4CAF50;
    padding: 0 0.5rem;
`;

export default Pagination;

