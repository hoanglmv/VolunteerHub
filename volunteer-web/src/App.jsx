import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- Import mới
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} /> {/* <--- Route mới */}

                <Route path="/" element={
                    <PrivateRoute><HomePage /></PrivateRoute>
                } />

                <Route path="/admin" element={
                    <PrivateRoute><AdminPage /></PrivateRoute>
                } />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
    );
}

export default App;