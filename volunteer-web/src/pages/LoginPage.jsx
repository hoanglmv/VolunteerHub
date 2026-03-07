import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, HeartHandshake, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosClient.post('/auth/login', { email, password });
            const token = res.data;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.authorities;

            // Lấy email làm username tạm thời
            localStorage.setItem('username', decoded.sub || email.split('@')[0]);
            localStorage.setItem('role', role);

            toast.success("Đăng nhập thành công!");

            // Chuyển hướng Navbar reload auth state (có thể dùng Context API thực tế)
            window.dispatchEvent(new Event('storage'));

            if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại! Kiểm tra lại email/pass.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-gray-50 p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-2xl border border-white relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4 shadow-sm">
                        <HeartHandshake className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Đăng Nhập</h2>
                    <p className="text-gray-500 mt-2">Chào mừng bạn trở lại với VolunteerHub</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                required
                                type="email"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">Quên mật khẩu?</Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md shadow-primary-500/20 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        <span className="mr-2">{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}</span>
                        {!isLoading && <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                        Đăng ký ngay bây giờ
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}