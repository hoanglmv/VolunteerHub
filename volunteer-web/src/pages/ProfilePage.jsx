import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, CheckCircle2, XCircle, Clock, Settings, Shield, Award } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
    const location = useLocation();

    // Determine active tab based on route
    const initialTab = location.pathname.includes('/settings') ? 'settings' : 'history';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [participations, setParticipations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const username = localStorage.getItem('username') || 'Người dùng';
    const userRole = localStorage.getItem('role') || 'USER';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=10b981&color=fff&size=128&bold=true`;

    useEffect(() => {
        if (activeTab === 'history') {
            fetchParticipations();
        }
    }, [activeTab]);

    const fetchParticipations = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/participations/my-events?page=0&size=10');
            setParticipations(res.data.content || []);
        } catch (error) {
            console.error(error);
            toast.error("Không thể lấy lịch sử tham gia");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Đã duyệt</span>;
            case 'REJECTED':
                return <span className="flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-medium"><XCircle className="w-3.5 h-3.5 mr-1" /> Từ chối</span>;
            default:
                return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md text-xs font-medium"><Clock className="w-3.5 h-3.5 mr-1" /> Chờ duyệt</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
                    <div className="h-32 bg-gradient-to-r from-primary-400 to-emerald-500"></div>
                    <div className="px-6 sm:px-10 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end space-x-5">
                                <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-md">
                                    <img src={avatarUrl} alt="Profile Avatar" className="h-full w-full object-cover" />
                                </div>
                                <div className="pb-2 hidden sm:block">
                                    <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                                    <p className="text-sm font-medium text-primary-600 flex items-center mt-1">
                                        <Award className="w-4 h-4 mr-1" />
                                        {userRole === 'ADMIN' ? 'Quản trị viên' : 'Thành viên Tích cực'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Name Display */}
                        <div className="sm:hidden mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                            <p className="text-sm font-medium text-primary-600 flex items-center mt-1">
                                <Award className="w-4 h-4 mr-1" />
                                {userRole === 'ADMIN' ? 'Quản trị viên' : 'Thành viên Tích cực'}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 border-b border-gray-100 mt-2 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Lịch sử Sự kiện
                            </button>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Thông tin Cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Cài đặt & Bảo mật
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-20 min-h-[400px]">

                    {/* LỊCH SỬ THAM GIA */}
                    {activeTab === 'history' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                Các sự kiện đã trải qua
                            </h2>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                </div>
                            ) : participations.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">Belum ada acara</h3>
                                    <p className="text-gray-500 mt-1">Bạn chưa đăng ký tham gia sự kiện nào.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {participations.map((p) => (
                                        <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-sm transition-all bg-white group">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {p.event?.title || 'Sự kiện không xác định'}
                                                </h3>
                                                <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                                                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {p.event?.startTime ? format(new Date(p.event.startTime), 'dd/MM/yyyy') : 'N/A'}</span>
                                                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {p.event?.location || 'Trực tuyến'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex flex-col items-end">
                                                {getStatusBadge(p.status)}
                                                <span className="text-xs text-gray-400 mt-2 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" /> Đăng ký ngày {format(new Date(p.registeredAt), 'dd/MM/yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* THÔNG TIN CÁ NHÂN TĨNH */}
                    {activeTab === 'info' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Hồ sơ Tình nguyện viên</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <User className="w-5 h-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900 font-medium">{username}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email liên hệ</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900 font-medium">Bảo mật (Chỉ hiển thị cho Ban Tổ Chức)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                            <span className="text-gray-500 italic">Chưa cập nhật</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Cấp bậc</label>
                                        <div className="flex items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
                                            <Shield className="w-5 h-5 mr-3" />
                                            <span className="font-semibold">{userRole === 'ADMIN' ? 'Administrator' : 'Volunteer'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 shadow-sm transition-colors">
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* CÀI ĐẶT TÀI KHOẢN */}
                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Cài đặt & Bảo mật</h2>

                            <div className="space-y-6 max-w-2xl">
                                <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Đổi mật khẩu</h3>
                                        <p className="text-sm text-gray-500 mt-1">Bạn nên đổi mật khẩu định kỳ để bảo đảm an toàn cho tài khoản.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                                        Thay đổi
                                    </button>
                                </div>

                                <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Thông báo (Email & Web)</h3>
                                        <p className="text-sm text-gray-500 mt-1">Cài đặt loại thông báo bạn muốn nhận từ hệ thống.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className="p-5 border border-red-100 rounded-2xl bg-red-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10">
                                    <div>
                                        <h3 className="font-semibold text-red-700">Xóa tài khoản</h3>
                                        <p className="text-sm text-red-600/80 mt-1">Dữ liệu tham gia của bạn sẽ bị vô hiệu hóa vĩnh viễn.</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.")) {
                                                try {
                                                    await axiosClient.delete('/users/me');
                                                    toast.success("Tài khoản đã được xóa.");
                                                    localStorage.clear();
                                                    window.location.href = '/login';
                                                } catch (err) {
                                                    toast.error("Lỗi khi xóa tài khoản.");
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap bg-white"
                                    >
                                        Xóa ngay
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
