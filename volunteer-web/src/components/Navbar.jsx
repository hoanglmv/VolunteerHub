import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut, Search, Menu, X, Settings, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fake token check, consider pulling this from a Context or actual local storage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username') || 'Người dùng';

    // Generate an avatar based on username initial or use a default one
    const avatarUrl = token ? `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=10b981&color=fff&bold=true` : '';

    // Handle clicks outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setIsProfileDropdownOpen(false);
        navigate('/');
    };

    return (
        <nav className="fixed w-full top-0 z-50 glass shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white/70 backdrop-blur-lg border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 duration-300">
                            <HeartHandshake className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl text-gray-800 tracking-tight">
                            Volunteer<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-primary-600 font-semibold transition-colors">Trang Chủ</Link>
                            <Link to="/events" className="text-gray-600 hover:text-primary-600 font-semibold transition-colors">Tham gia tình nguyện</Link>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group hidden lg:block">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sự kiện..."
                                className="pl-11 pr-4 py-2.5 w-64 xl:w-72 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm shadow-inner"
                            />
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                    </div>

                    {/* Auth Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {token ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/create-event"
                                    className="hidden lg:flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full font-semibold transition-colors border border-emerald-100/50"
                                >
                                    <span className="text-xl leading-none">+</span>
                                    <span>Tạo Sự kiện</span>
                                </Link>
                                <div className="relative" ref={dropdownRef}>
                                    {/* Avatar Button */}
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all p-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 overflow-hidden ring-1 ring-gray-200 shadow-sm"
                                    >
                                        <img src={avatarUrl} alt="User Avatar" className="h-full w-full rounded-full object-cover" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
                                                    <p className="text-xs font-medium text-emerald-600 mt-0.5">{userRole === 'ADMIN' ? 'Quản trị viên' : 'Tình nguyện viên'}</p>
                                                </div>

                                                <div className="p-2 space-y-1">
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium rounded-xl transition-colors"
                                                    >
                                                        <UserIcon className="h-4 w-4" />
                                                        <span>Trang cá nhân</span>
                                                    </Link>

                                                    {userRole === 'ADMIN' && (
                                                        <Link
                                                            to="/admin"
                                                            onClick={() => setIsProfileDropdownOpen(false)}
                                                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium rounded-xl transition-colors"
                                                        >
                                                            <LayoutDashboard className="h-4 w-4" />
                                                            <span>Trang quản trị</span>
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to="/settings"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium rounded-xl transition-colors"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        <span>Cài đặt tài khoản</span>
                                                    </Link>
                                                </div>

                                                <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-xl transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Đăng xuất</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-semibold px-4 py-2 transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-primary-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                    Tham gia ngay
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 focus:outline-none p-2 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <div className="py-3 px-2 mb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sự kiện..."
                                        className="pl-10 pr-4 py-3 w-full rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                                    />
                                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">Trang Chủ</Link>

                            {token && (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">Trang cá nhân</Link>
                                    <Link to="/create-event" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors">Tạo sự kiện mới</Link>
                                </>
                            )}

                            {userRole === 'ADMIN' && (
                                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors">Quản Trị</Link>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-3 px-2">
                                {token ? (
                                    <>
                                        <div className="flex items-center space-x-3 px-2 mb-4">
                                            <img src={avatarUrl} alt="Avatar" className="h-12 w-12 rounded-full ring-2 ring-primary-500 ring-offset-2" />
                                            <div>
                                                <p className="font-bold text-gray-900">{username}</p>
                                                <p className="text-sm font-medium text-emerald-600">{userRole === 'ADMIN' ? 'Quản trị viên' : 'Tình nguyện viên'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 text-red-600 font-semibold bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center px-4 py-3.5 text-gray-700 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                            Đăng nhập
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center px-4 py-3.5 text-white font-semibold bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl shadow-md transition-all hover:shadow-lg">
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;