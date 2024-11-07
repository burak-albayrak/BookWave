import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // datepicker for rezervation
import 'react-datepicker/dist/react-datepicker.css';

const GIDICIMainPage = () => {
    const [bookName, setBookName] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // select date part
    const navigate = useNavigate();


    // try try try try
    const handleSearch = () => {
        const books = [
            { name: 'Book A', available: true },
            { name: 'Book B', available: false, earliestReservationDate: '2024-10-30' },
        ];

        const foundBook = books.find(book => book.name.toLowerCase() === bookName.toLowerCase());

        if (foundBook) {
            setSearchResult(foundBook);
        } else {
            setSearchResult(null);
        }
    };

    const handleReserve = () => {
        if (selectedDate) {
            alert(`Reservation made successfully! Book Information: ${searchResult.name}, Date: ${selectedDate.toLocaleDateString()}`);
            // Burada rezervasyon işlemini gerçekleştirebilirsiniz
            // Örneğin, bu bilgiyi bir API'ye gönderin
        } else {
            alert('Please select a date.');
        }
    };

    return (
        <div style={mainPageStyle}>
            <h1 style={headerStyle}>Welcome</h1>
            <div style={searchContainerStyle}>
                <h3>Search for the Book You're Looking For:</h3>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Please enter book name."
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />
                <button style={buttonStyle} onClick={handleSearch}>Search</button>

                {searchResult !== null && (
                    <div style={resultContainerStyle}>
                        <h4>Search Result:</h4>
                        <p>Book Name <strong>{searchResult.name}</strong></p>
                        {searchResult.available ? (
                            <>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    placeholderText="Please select a date."
                                    dateFormat="dd/MM/yyyy"
                                    style={datePickerStyle}
                                />
                                <button style={buttonStyle} onClick={handleReserve}>Make a Reservation</button>
                            </>
                        ) : (
                            <p>The book is not available at the moment, it is with another user. Earliest booking date for you: <strong>{searchResult.earliestReservationDate}</strong></p>
                        )}
                    </div>
                )}
                {searchResult === null && bookName && <p>No book by that name was found.</p>}
            </div>
        </div>
    );
};


const mainPageStyle = {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '20px auto',
};

const headerStyle = {
    textAlign: 'center',
    color: '#333',
};

const searchContainerStyle = {
    marginTop: '20px',
};

const inputStyle = {
    width: '70%',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const resultContainerStyle = {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
};

const datePickerStyle = {
    margin: '10px 0',
};

export default GIDICIMainPage;
