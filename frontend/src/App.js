import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/User/UserLogin';
import Register from './components/User/Register';
import MainPage from './components/User/MainPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPage from './components/Admin/AdminPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} /> {/* Ana path register sayfası */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<MainPage />} /> {/* Giriş sonrası yönlendirme */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
};

export default App;
