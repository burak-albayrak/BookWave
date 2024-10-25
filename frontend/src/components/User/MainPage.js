import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const [reservationDate, setReservationDate] = useState(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        // Kitap arama durumu
        if (searchQuery === 'Mevcut Kitap') {
            setIsAvailable(true);
        } else {
            setIsAvailable(false);
            setReservationDate('2024-11-01'); // En erken rezervasyon tarihi
        }
    };

    const handleReservation = (e) => {
        e.preventDefault();
        // Rezervasyon işlemi
        alert(`Rezervasyon tamamlandı: ${reservationDate}`);
    };

    return (
        <div>
            <h1>Hoşgeldin</h1>
            <button onClick={() => navigate('/user')}>Profil</button>

            <h3>Kitap Arama</h3>
            <input
                type="text"
                placeholder="Kitap Adı"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Ara</button>

            {isAvailable && (
                <form onSubmit={handleReservation}>
                    <label>Rezervasyon Tarihini Seçin:</label>
                    <input type="date" onChange={(e) => setReservationDate(e.target.value)} required />
                    <button type="submit">Rezervasyon Yap</button>
                </form>
            )}

            {isAvailable === false && <p>En erken rezervasyon tarihi: {reservationDate}</p>}
        </div>
    );
};

export default MainPage;