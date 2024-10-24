import React from 'react';
import Header from '../Header';

const MainPage = ({ username }) => {
    return (
        <div>
            <Header username={username} />
            <h2>Search for Books</h2>
            {/* Arama çubuğu ve kitap listesi buraya gelecek */}
        </div>
    );
};

export default MainPage;
