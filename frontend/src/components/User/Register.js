
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // E-posta ve şifre ile kayıt işlemleri
        console.log("Kayıt Bilgileri:", { email, password });
        navigate('/main'); // Kayıt başarılıysa ana sayfaya yönlendirme
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleRegister}>
                <label>
                    E-posta:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Şifre:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Kayıt Ol</button>
            </form>
            <p>Zaten kullanıcı mısınız? <button onClick={() => navigate('/login')}>Giriş Yap</button></p>
        </div>
    );
};

export default Register;
