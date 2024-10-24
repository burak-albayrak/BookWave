import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate ekledik

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Yönlendirme işlemi için kullanıyoruz

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kayıt işlemleri burada yapılacak (backend'e gönderme vs.)
        // Başarılı kayıt sonrası ana sayfaya yönlendirme
        console.log("Kullanıcı kaydedildi:", { username, email, password });
        navigate('/'); // Başarılı kayıt sonrası ana sayfaya yönlendiriyoruz
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Kullanıcı Adı:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Kayıt Ol</button>
            </form>

            <p>Zaten kullanıcı mısınız? O zaman <Link to="/login">Giriş Yapın</Link></p>
        </div>
    );
};

export default Register;
