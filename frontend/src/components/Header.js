import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const { state } = useContext(UserContext);
    const { user } = state;
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (user) {
            navigate('/main'); // Ana sayfaya yönlendir
        } else {
            alert("Lütfen önce giriş yapın veya kayıt olun."); // Kullanıcıyı bilgilendirme
        }
    };

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle} onClick={handleLogoClick}>
                <span style={linkStyle}>BookWave</span>
            </h1>
            {user && <Link to="/user" style={linkStyle}>User Page</Link>} {/* User Page linki sadece giriş yapıldıysa gözükecek */}
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
    cursor: 'pointer', // Başlık metni tıklanabilir olacak
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
};

export default Header;
