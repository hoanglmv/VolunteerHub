import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom'; // <--- Nhớ import Link
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/auth/login', { email, password });
            const token = res.data;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.authorities;

            toast.success("Đăng nhập thành công!");

            if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại! Kiểm tra lại email/pass.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">VolunteerHub Login</h2>
                <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full p-2 border rounded" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Đăng nhập</button>

                {/* Phần thêm link đăng ký */}
                <div className="text-center text-sm mt-4">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký ngay</Link>
                </div>
            </form>
        </div>
    );
}