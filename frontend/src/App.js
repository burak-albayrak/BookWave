import React from 'react';
import UserLogin from './components/User/UserLogin';
import Register from './components/User/Register';
import MainPage from './components/User/MainPage';
import UserPage from './components/User/UserPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPage from './components/Admin/AdminPage';

const App = () => {
  return (
      <div>
        <UserLogin />
        <Register />
        <MainPage username="X" />
        <UserPage />
        <AdminLogin />
        <AdminPage />
      </div>
  );
};

export default App;
