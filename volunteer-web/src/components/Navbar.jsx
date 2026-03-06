import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('token') ? "User" : "Guest"; // Có thể decode token để lấy tên thật nếu muốn

    const handleLogout = () => {
        // 1. Xóa token khỏi bộ nhớ
        localStorage.removeItem('token');
        // 2. Chuyển hướng về trang đăng nhập
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                VolunteerHub
            </h1>
            <div className="flex gap-4 items-center">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded text-sm"
                >
                    Đăng xuất
                </button>
            </div>
        </nav>
    );
}