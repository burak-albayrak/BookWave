import React, { createContext, useReducer } from 'react';

const initialState = {
    user: null, // Kullanıcı bilgilerini tutacak
};

const UserContext = createContext();

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload }; // Kullanıcıyı ayarla
        case 'LOG_OUT':
            return { ...state, user: null }; // Kullanıcıyı çıkart
        default:
            return state;
    }
};

const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
