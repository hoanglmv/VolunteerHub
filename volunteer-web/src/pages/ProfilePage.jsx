import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, CheckCircle2, XCircle, Clock, Settings, Shield, Award, Edit2, KeyRound, Star, Heart } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
    const location = useLocation();

    // Determine active tab based on route
    const initialTab = location.pathname.includes('/settings') ? 'settings' : 'history';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [participations, setParticipations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // User data state
    const [userData, setUserData] = useState(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const avatarUrl = userData ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=10b981&color=fff&size=128&bold=true` : '';

    useEffect(() => {
        fetchUserProfile();
        fetchParticipations(); // Always fetch to get Gamification stats
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await axiosClient.get('/users/profile');
            setUserData(res.data);
            setEditForm({ fullName: res.data.fullName || '', phone: res.data.phone || '' });
        } catch (error) {
            toast.error("Không thể tải thông tin cá nhân");
        }
    };

    const fetchParticipations = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/participations/my-events?page=0&size=500');
            setParticipations(res.data.content || []);
        } catch (error) {
            toast.error("Không thể lấy lịch sử tham gia");
        } finally {
            setIsLoading(false);
        }
    };

    // Gamification Logic
    const getGamificationBadge = () => {
        const approvedCount = participations.filter(p => p.status === 'APPROVED').length;
        if (approvedCount === 0) return { name: "Thành viên mới", color: "text-gray-500", bg: "bg-gray-100", icon: <User className="w-4 h-4 mr-1" /> };
        if (approvedCount <= 3) return { name: "Trái tim Đồng", color: "text-amber-700", bg: "bg-amber-100", icon: <Heart className="w-4 h-4 mr-1" /> };
        if (approvedCount <= 10) return { name: "Trái tim Bạc", color: "text-gray-600", bg: "bg-gray-200", icon: <Star className="w-4 h-4 mr-1" /> };
        return { name: "Trái tim Vàng", color: "text-yellow-600", bg: "bg-yellow-100", icon: <Award className="w-4 h-4 mr-1" /> };
    };

    const badge = getGamificationBadge();

    const handleUpdateProfile = async () => {
        if (!editForm.fullName.trim()) return toast.error("Tên không được để trống");

        try {
            const res = await axiosClient.put('/users/profile', editForm);
            setUserData(res.data);
            // Cập nhật lại tên trên LocalStorage nếu Navbar có dùng
            localStorage.setItem('username', res.data.fullName);
            setIsEditingInfo(false);
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Cập nhật thất bại");
        }
    };

    const handleChangePassword = async () => {
        if (passForm.newPassword !== passForm.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }
        if (passForm.newPassword.length < 6) {
            return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
        }

        try {
            await axiosClient.put('/users/password', {
                oldPassword: passForm.oldPassword,
                newPassword: passForm.newPassword
            });
            toast.success("Đổi mật khẩu thành công!");
            setIsChangingPassword(false);
            setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data || "Đổi mật khẩu thất bại, kiểm tra lại mật khẩu cũ.");
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

    if (!userData) return <div className="min-h-screen flex items-center justify-center">Đang tải hồ sơ...</div>;

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
                                    <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <p className="text-sm font-medium text-primary-600 flex items-center">
                                            <Shield className="w-4 h-4 mr-1" />
                                            {userData.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                                        </p>
                                        <span className={`text-sm font-bold flex items-center px-2 py-0.5 rounded-md ${badge.bg} ${badge.color}`}>
                                            {badge.icon} {badge.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Name Display */}
                        <div className="sm:hidden mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                <p className="text-sm font-medium text-primary-600 flex items-center">
                                    <Shield className="w-4 h-4 mr-1" />
                                    {userData.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                                </p>
                                <span className={`text-sm font-bold flex items-center px-2 py-0.5 rounded-md ${badge.bg} ${badge.color}`}>
                                    {badge.icon} {badge.name}
                                </span>
                            </div>
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
                                    <h3 className="text-lg font-medium text-gray-900">Chưa có sự kiện</h3>
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

                    {/* THÔNG TIN CÁ NHÂN */}
                    {activeTab === 'info' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Hồ sơ Tình nguyện viên</h2>
                                {!isEditingInfo ? (
                                    <button onClick={() => setIsEditingInfo(true)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4 mr-1.5" /> Chỉnh sửa
                                    </button>
                                ) : (
                                    <button onClick={() => setIsEditingInfo(false)} className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 transition-colors">
                                        Hủy
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                                        {isEditingInfo ? (
                                            <input
                                                type="text"
                                                value={editForm.fullName}
                                                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                                className="w-full p-2.5 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            />
                                        ) : (
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <User className="w-5 h-5 text-gray-400 mr-3" />
                                                <span className="text-gray-900 font-medium">{userData.fullName}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Email liên hệ</label>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-70 cursor-not-allowed">
                                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900 font-medium">{userData.email}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Ý! Email không thể thay đổi.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                                        {isEditingInfo ? (
                                            <input
                                                type="text"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="VD: 0912345678"
                                                className="w-full p-2.5 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            />
                                        ) : (
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                                <span className={`font-medium ${userData.phone ? 'text-gray-900' : 'text-gray-500 italic'}`}>{userData.phone || 'Chưa cập nhật'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Cấp bậc</label>
                                        <div className="flex items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700">
                                            <Shield className="w-5 h-5 mr-3" />
                                            <span className="font-semibold">{userData.role === 'ADMIN' ? 'Administrator' : 'Volunteer'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isEditingInfo && (
                                <div className="mt-8 flex justify-end">
                                    <button onClick={handleUpdateProfile} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 shadow-sm transition-colors flex items-center">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* CÀI ĐẶT TÀI KHOẢN */}
                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Cài đặt & Bảo mật</h2>

                            <div className="space-y-6 max-w-2xl">
                                <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 flex items-center"><KeyRound className="w-4 h-4 mr-2" /> Đổi mật khẩu</h3>
                                            <p className="text-sm text-gray-500 mt-1">Bạn nên đổi mật khẩu định kỳ để bảo đảm an toàn cho tài khoản.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                                            className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${isChangingPassword ? 'bg-gray-100 text-gray-700' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
                                        >
                                            {isChangingPassword ? 'Đóng' : 'Thay đổi'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isChangingPassword && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-5 pb-5 border-t border-gray-50 pt-4 bg-gray-50/50"
                                            >
                                                <div className="space-y-4 max-w-sm">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                                                        <input type="password" value={passForm.oldPassword} onChange={e => setPassForm({ ...passForm, oldPassword: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                                        <input type="password" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiết lộ mật khẩu mới (Xác nhận)</label>
                                                        <input type="password" value={passForm.confirmPassword} onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                                    </div>
                                                    <button onClick={handleChangePassword} className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Cập nhật Mật khẩu</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                                    <button className="px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap bg-white cursor-pointer">
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
