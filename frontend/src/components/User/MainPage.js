import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Takvim bileşenini içe aktar
import 'react-datepicker/dist/react-datepicker.css'; // Takvim stilini içe aktar

const MainPage = () => {
    const [bookName, setBookName] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // Seçilen tarih durumu
    const navigate = useNavigate();

    const handleSearch = () => {
        const books = [
            { name: 'Kitap A', available: true },
            { name: 'Kitap B', available: false, earliestReservationDate: '2024-10-30' },
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
            alert(`Rezervasyon yapıldı! Kitap: ${searchResult.name}, Tarih: ${selectedDate.toLocaleDateString()}`);
            // Burada rezervasyon işlemini gerçekleştirebilirsiniz
            // Örneğin, bu bilgiyi bir API'ye gönderin
        } else {
            alert('Lütfen bir tarih seçin.');
        }
    };

    return (
        <div style={mainPageStyle}>
            <h1 style={headerStyle}>Hoşgeldin</h1>
            <div style={searchContainerStyle}>
                <h3>Kitap Arama</h3>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Kitap adı girin"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />
                <button style={buttonStyle} onClick={handleSearch}>Ara</button>

                {searchResult !== null && (
                    <div style={resultContainerStyle}>
                        <h4>Arama Sonucu:</h4>
                        <p>Kitap Adı: <strong>{searchResult.name}</strong></p>
                        {searchResult.available ? (
                            <>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    placeholderText="Tarih Seçin"
                                    dateFormat="dd/MM/yyyy"
                                    style={datePickerStyle}
                                />
                                <button style={buttonStyle} onClick={handleReserve}>Rezervasyon Yap</button>
                            </>
                        ) : (
                            <p>Kitap mevcut değil. En erken rezervasyon tarihi: <strong>{searchResult.earliestReservationDate}</strong></p>
                        )}
                    </div>
                )}
                {searchResult === null && bookName && <p>Bu isimde bir kitap bulunamadı.</p>}
            </div>
        </div>
    );
};

// Stil stilleri
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

export default MainPage;
