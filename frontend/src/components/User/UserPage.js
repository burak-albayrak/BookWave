import React from 'react';

const UserPage = () => {
    // Kullanıcı bilgilerini state veya props ile alabilirsin. Şimdilik sabit bir bilgi gösteriyorum.
    const userInfo = {
        username: 'Kullanıcı Adı',
        email: 'kullanici@example.com'
    };

    return (
        <div>
            <h1>Profil Bilgileri</h1>
            <p>Kullanıcı Adı: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
        </div>
    );
};

export default UserPage;
