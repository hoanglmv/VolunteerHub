import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'USER' // Using default USER role instead of VOLUNTEER to match DB enum
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axiosClient.post('/auth/register', formData);
            // Kích hoạt giao diện thành công
            setIsSuccess(true);
        } catch (error) {
            toast.error(error.response?.data || "Đăng ký thất bại! Email có thể đã tồn tại.");
            setIsLoading(false);
        }
    };

    // Effect đếm ngược 3 giây khi đăng ký thành công rồi chuyển hướng
    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isSuccess, navigate]);

    // UI Màn hình thành công
    if (isSuccess) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-gray-50 p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full glass rounded-3xl p-10 text-center shadow-xl border border-gray-100"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6"
                    >
                        <CheckCircle2 className="h-14 w-14 text-green-500" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đăng ký thành công!
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Chào mừng bạn gia nhập cộng đồng. Vui lòng kiểm tra email để xác thực tài khoản.
                    </p>

                    {/* Thanh tiến trình giảm dần trong 3s */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 3, ease: "linear" }}
                            className="bg-primary-500 h-1.5 rounded-full"
                        />
                    </div>
                    <p className="text-sm text-gray-500">Đang chuyển hướng tới Đăng nhập...</p>
                </motion.div>
            </div>
        );
    }

    // UI Form Đăng ký
    return (
        <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-gray-50 p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass rounded-3xl p-8 shadow-2xl border border-white relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tạo tài khoản</h2>
                    <p className="text-gray-500 mt-2">Bắt đầu hành trình tình nguyện của bạn</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                required
                                name="fullName"
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="Nhập họ và tên của bạn"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                required
                                name="email"
                                type="email"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                required
                                name="password"
                                type="password"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md shadow-primary-500/20 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        <span className="mr-2">{isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}</span>
                        {!isLoading && <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                        Đăng nhập tại đây
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}