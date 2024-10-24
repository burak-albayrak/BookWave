import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate ekledik

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Yönlendirme işlemi için kullanıyoruz

    const handleLogin = (e) => {
        e.preventDefault();
        // Giriş işlemleri burada yapılacak (backend doğrulaması vs.)
        // Başarılı giriş sonrası ana sayfaya yönlendirme
        console.log("Giriş yapıldı:", { email, password });
        navigate('/main'); // Başarılı giriş sonrası MainPage'e yönlendiriyoruz
    };

    return (
        <div>
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">E-posta:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Şifre:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    );
};

export default Login;
