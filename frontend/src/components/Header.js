import React from 'react';

const Header = ({ username }) => {
    return (
        <header>
            <h1>Welcome to Murat {username}</h1>
            <button>Profile</button>
        </header>
    );
};

export default Header;
