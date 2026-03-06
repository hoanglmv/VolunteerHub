import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'VOLUNTEER' // Mặc định là Tình nguyện viên
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Gọi API đăng ký
            await axiosClient.post('/auth/register', formData);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login'); // Chuyển ngay về trang login
        } catch (error) {
            toast.error("Đăng ký thất bại! Email có thể đã tồn tại.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="p-8 bg-white rounded shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center text-blue-600">Đăng Ký Tài Khoản</h2>

                <input required name="fullName" placeholder="Họ và tên" className="w-full border p-2 rounded" onChange={handleChange} />
                <input required name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleChange} />
                <input required name="password" type="password" placeholder="Mật khẩu" className="w-full border p-2 rounded" onChange={handleChange} />

                {/* Chọn vai trò (Để test cho tiện, thực tế có thể ẩn đi) */}
                <select name="role" className="w-full border p-2 rounded" onChange={handleChange}>
                    <option value="VOLUNTEER">Tình nguyện viên</option>
                    <option value="ADMIN">Quản trị viên (Admin)</option>
                </select>

                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 font-bold">
                    Đăng Ký Ngay
                </button>

                <div className="text-center text-sm">
                    Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
}