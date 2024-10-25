import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Kullanıcı Bilgileri</h2>
            {/* Kullanıcı bilgilerini burada gösterin */}
            <button onClick={() => navigate('/main')}>Ana Sayfaya Dön</button>
        </div>
    );
};

export default UserPage;