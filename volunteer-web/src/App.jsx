import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventManagementPage from './pages/EventManagementPage';
import CreateArticlePage from './pages/CreateArticlePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MyEventsPage from './pages/MyEventsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow pt-16">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/" element={
                            <PrivateRoute><HomePage /></PrivateRoute>
                        } />

                        <Route path="/create-event" element={
                            <PrivateRoute><CreateEventPage /></PrivateRoute>
                        } />

                        <Route path="/events" element={
                            <PrivateRoute><EventsPage /></PrivateRoute>
                        } />

                        <Route path="/events/:id" element={
                            <PrivateRoute><EventDetailPage /></PrivateRoute>
                        } />

                        <Route path="/events/:id/manage" element={
                            <PrivateRoute><EventManagementPage /></PrivateRoute>
                        } />

                        <Route path="/leaderboard" element={
                            <PrivateRoute><LeaderboardPage /></PrivateRoute>
                        } />

                        <Route path="/my-events" element={
                            <PrivateRoute><MyEventsPage /></PrivateRoute>
                        } />

                        <Route path="/create-news" element={
                            <PrivateRoute><CreateArticlePage /></PrivateRoute>
                        } />

                        <Route path="/news/:id" element={
                            <PrivateRoute><ArticleDetailPage /></PrivateRoute>
                        } />

                        {/* Thêm Route cho hồ sơ và cài đặt sử dụng chung component ProfilePage với tab ẩn bên trong */}
                        <Route path="/profile" element={
                            <PrivateRoute><ProfilePage /></PrivateRoute>
                        } />
                        <Route path="/settings" element={
                            <PrivateRoute><ProfilePage /></PrivateRoute>
                        } />

                        <Route path="/admin" element={
                            <PrivateRoute><AdminPage /></PrivateRoute>
                        } />
                    </Routes>
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
    );
}

export default App;