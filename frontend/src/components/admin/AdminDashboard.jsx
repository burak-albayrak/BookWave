import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

const AdminDashboard = () => {
    const { state } = useContext(UserContext);
    const { user } = state;

    const [publisher, setPublisher] = useState('');
    const [author, setAuthor] = useState('');
    const [bookTitle, setBookTitle] = useState('');

    const [section, setSection] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        dateOfBirth: '',
        location: ''
    });


    const [users, setUsers] = useState([
        { id: 1, name: "User One", email: "userone@example.com" },
        { id: 2, name: "User Two", email: "usertwo@example.com" }
    ]);
    const [books, setBooks] = useState([
        { id: 1, title: 'Book 1', publisher: 'Publisher 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', publisher: 'Publisher 2', author: 'Author 2' },
        { id: 3, title: 'Book 3', publisher: 'Publisher 3', author: 'Author 3' },
    ]);

    const [searchUser, setSearchUser] = useState('');
    const [searchBook, setSearchBook] = useState('');
    const [newBook, setNewBook] = useState({
        title: '',
        publisher: '',
        author: ''
    });
    const [editBook, setEditBook] = useState({
        title: '',
        publisher: '',
        author: ''
    });

    // Section Handlers
    const handleShowUser = () => setSection('showUsers');
    const handleAddUser = () => setSection('addUser');
    const handleDeleteUser = () => setSection('deleteUser');
    const handleShowBook = () => setSection('showBooks');
    const handleAddBook = () => setSection('addBook');
    const handleDeleteBook = () => setSection('deleteBook');
    const handleEditBook = () => setSection('editBook');

    // Form input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleBookInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleEditBookInputChange = (e) => {
        const { name, value } = e.target;
        setEditBook({ ...editBook, [name]: value });
    };

    const handleSubmitUser = (e) => {
        e.preventDefault();
        alert('The user added successfully!');
        setNewUser({
            name: '',
            surname: '',
            email: '',
            password: '',
            dateOfBirth: '',
            location: ''
        });
    };

    // Add Book Form submit handler
    const handleSubmitBook = (e) => {
        e.preventDefault();
        setBooks([...books, { ...newBook, id: books.length + 1 }]);
        alert('The book added successfully!');
        setNewBook({
            title: '',
            publisher: '',
            author: ''
        });
    };

    // Edit Book Form submit handler
    const handleSubmitEditBook = (e) => {
        e.preventDefault();
        const updatedBooks = books.map(book =>
            book.title === editBook.title ? { ...book, publisher: editBook.publisher, author: editBook.author } : book
        );
        setBooks(updatedBooks);
        alert('The book updated successfully!');
        setEditBook({
            title: '',
            publisher: '',
            author: ''
        });
    };

    // Delete User handler
    const handleUserDelete = () => {
        const userToDelete = users.find((u) => u.email === searchUser);
        if (userToDelete) {
            setUsers(users.filter((u) => u.email !== searchUser));
            alert('The user deleted successfully!');
        } else {
            alert('User not found.!');
        }
        setSearchUser('');
    };

    // Delete Book handler
    const handleBookDelete = () => {
        const bookToDelete = books.find((b) => b.title.toLowerCase() === searchBook.toLowerCase());
        if (bookToDelete) {
            setBooks(books.filter((b) => b.title.toLowerCase() !== searchBook.toLowerCase()));
            alert('The book deleted successfully!');
        } else {
            alert('Book not found.!');
        }
        setSearchBook('');
    };

    return (
        <div>
            <h2>Admin Page</h2>
            <p>Welcome!</p>

            <button onClick={handleShowUser}>Show the Users</button>
            <button onClick={handleAddUser}>Add User</button>
            <button onClick={handleDeleteUser}>Delete User</button>
            <br/>
            <button onClick={handleShowBook}>Show the Books</button>

            <button onClick={handleAddBook}>Add Book</button>
            <button onClick={handleDeleteBook}>Delete Book</button>
            <button onClick={handleEditBook}>Edit Book</button>

            <div style={{marginTop: '20px', padding: '10px', border: '1px solid #ccc'}}>
                {section === 'showUsers' && (
                    <div>
                        <h3>All Users</h3>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {user.name} - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {section === 'showBooks' && (
                    <div>
                        <h3>All Books</h3>
                        <ul>
                            {books.map((book) => (
                                <li key={book.id}>
                                    {book.title} - {book.publisher} - {book.author}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                {section === 'addUser' && (
                    <div>
                        <h3>Add User</h3>
                        <form onSubmit={handleSubmitUser}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Surname:
                                <input
                                    type="text"
                                    name="surname"
                                    value={newUser.surname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Date of Birth:
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={newUser.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={newUser.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}

                {section === 'deleteUser' && (
                    <div>
                        <h3>Delete User</h3>
                        <label>
                            Search User by Email:
                            <input
                                type="text"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                placeholder="Enter user email"
                                required
                            />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <br/>
                        <button onClick={handleUserDelete}>Delete User</button>
                    </div>
                )}


                {section === 'deleteBook' && (
                    <div>
                        <h3>Delete Book</h3>
                        <label>
                            Search Book by Title:
                            <input
                                type="text"
                                value={searchBook}
                                onChange={(e) => setSearchBook(e.target.value)}
                                placeholder="Enter book title"
                                required
                            />
                        </label>
                        <br/>
                        <label>
                            Publisher:
                            <input
                                type="text"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                placeholder="Enter publisher name"
                                required
                            />
                        </label>
                        <br/>
                        <label>
                            Author:
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Enter author's name"
                                required
                            />
                        </label>
                        <br/>
                        <button onClick={handleBookDelete}>Delete Book</button>
                    </div>
                )}


                {section === 'addBook' && (
                    <div>
                        <h3>Add Book</h3>
                        <form onSubmit={handleSubmitBook}>
                            <label>
                                Book Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={newBook.title}
                                    onChange={handleBookInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Publisher:
                                <input
                                    type="text"
                                    name="publisher"
                                    value={newBook.publisher}
                                    onChange={handleBookInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <label>
                                Author:
                                <input
                                    type="text"
                                    name="author"
                                    value={newBook.author}
                                    onChange={handleBookInputChange}
                                    required
                                />
                            </label>
                            <br/>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )}

                {section === 'editBook' && (
                    <div>
                        <h3>Edit Book</h3>
                        <label>
                            Book Title to Edit:
                            <input
                                type="text"
                                name="title"
                                value={editBook.title}
                                onChange={handleEditBookInputChange}
                                placeholder="Enter book title"
                                required
                            />
                        </label>
                        <br/>
                        <label>
                            Publisher:
                            <input
                                type="text"
                                name="publisher"
                                value={editBook.publisher}
                                onChange={handleEditBookInputChange}
                                required
                            />
                        </label>
                        <br/>
                        <label>
                            Author:
                            <input
                                type="text"
                                name="author"
                                value={editBook.author}
                                onChange={handleEditBookInputChange}
                                required
                            />
                        </label>
                        <br/>
                        <button onClick={handleSubmitEditBook}>Submit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
