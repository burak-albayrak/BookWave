import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    // UserContext'i kullanarak kullanıcı durumunu alın
    const { state } = useContext(UserContext) || {};
    const { user } = state || {};
    const navigate = useNavigate();

    // admin olup olmadığını kontrol et (örneğin, user objesi içinde isAdmin varsa)
    const isAdmin = user?.isAdmin || false;


    const handleLogoClick = () => {
        if (user) {
            navigate('/main');
        } else {
            alert("Please login or register first.");
        }
    };

    return (
        <header style={headerStyle}>

            <h1 style={titleStyle} onClick={handleLogoClick}>
                <span style={linkStyle}>BookWave</span>
            </h1>

            {user && <Link to="/user" style={linkStyle}>User Page</Link>}

            {isAdmin && <Link to="/admin" style={linkStyle}>Admin Page</Link>}
        </header>
    );
};


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
    cursor: 'pointer', // Başlık metni tıklanabilir olacak
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
};

export default Header;
