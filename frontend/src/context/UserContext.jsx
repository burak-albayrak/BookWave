import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
};

export const UserContext = createContext(initialState);

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, user: action.payload };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { ...state, user: null };
        default:
            return state;
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};