import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';

const AdminPage = () => {
    const { state } = useContext(UserContext);
    const { user } = state;

    const handleAddUser = () => {
        alert("Kullanıcı eklendi!");
    };

    const handleDeleteUser = () => {
        alert("Kullanıcı silindi!");
    };

    const handleAddBook = () => {
        alert("Kitap eklendi!");
    };

    const handleDeleteBook = () => {
        alert("Kitap silindi!");
    };

    const handleEditBook = () => {
        alert("Kitap düzenlendi!");
    };

    return (
        <div>
            <h2>Admin Page</h2>
            <p>Hoşgeldiniz, {user.email}!</p>
            <button onClick={handleAddUser}>Kullanıcı Ekle</button>
            <button onClick={handleDeleteUser}>Kullanıcı Sil</button>
            <button onClick={handleAddBook}>Kitap Ekle</button>
            <button onClick={handleDeleteBook}>Kitap Sil</button>
            <button onClick={handleEditBook}>Kitap Düzenle</button>
        </div>
    );
};

export default AdminPage;
