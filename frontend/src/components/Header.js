import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { state } = useContext(UserContext);
    const { user } = state;

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>
                <Link to="/" style={linkStyle}>BookWave</Link>
                {user && <Link to="/user" style={linkStyle}>User Page</Link>} {/* User Page linki sadece giriş yapıldıysa gözükecek */}
            </h1>
        </header>
    );
};

// Stil stilleri
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
};
const titleStyle = {
    margin: 0,
};
const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
};

export default Header;
