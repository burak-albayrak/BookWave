import React, { createContext, useReducer } from 'react';

// Initial state for the user context
const initialState = {
    user: null,  // Default user state is null, indicating no user is logged in
};

// Create a context
export const UserContext = createContext(initialState);

// Reducer function to handle state changes based on action types
const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT_USER':
            return { ...state, user: null };
        default:
            return state;
    }
};

// UserProvider component to wrap the app with the context
export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
