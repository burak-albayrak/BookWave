import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const UserDashboard = () => {
    const { state } = useContext(UserContext);
    const { user } = state;

    return (
        <div>
            <h2>User Page</h2>
            {user ? (
                <div>
                    <p><strong>Name:</strong> {user.name} {user.surname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Date of Birth:</strong> {user.dob}</p>
                    <p><strong>Location:</strong> {user.location}</p>

                    <h3>Previously Read Books:</h3>
                    <ul>
                        {/* okunan kitapların ve tarihlerin listeleneceği bir yapı ekleee */}
                        <li>Book Title 1 - Reservation Date: YYYY-MM-DD</li>
                        <li>Book Title 2 - Reservation Date: YYYY-MM-DD</li>
                    </ul>

                    <h3>Currently Reading:</h3>
                    <ul>
                        {/*  şu an okunmakta olan kitapların ve tarihlerin listeleneceği bir yapı ekleeee*/}
                        <li>Current Book Title 1 - Borrowed From: YYYY-MM-DD To: YYYY-MM-DD</li>
                        <li>Current Book Title 2 - Borrowed From: YYYY-MM-DD To: YYYY-MM-DD</li>
                    </ul>
                </div>
            ) : (
                <p>Please log in to see your information.</p>
            )}
        </div>
    );
};

export default UserDashboard;
