import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Users, FileText, Flag, CheckCircle2, XCircle, Trash2, ShieldAlert, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events'); // events, reports, users

    const [pendingEvents, setPendingEvents] = useState([]);
    const [reportedContent, setReportedContent] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalParticipations: 0 });

    useEffect(() => {
        fetchStats();
        if (activeTab === 'events') fetchPendingEvents();
        if (activeTab === 'reports') fetchReports();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await axiosClient.get('/dashboard/stats');
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPendingEvents = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/events/pending');
            setPendingEvents(res.data.content || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách sự kiện chờ duyệt");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/reports?status=PENDING');
            setReportedContent(res.data.content || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/users?page=0&size=50');
            setUsers(res.data.content || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    // Actions
    const handleEventStatus = async (eventId, status) => {
        try {
            await axiosClient.put(`/events/${eventId}/status?status=${status}`);
            toast.success(status === 'APPROVED' ? "Đã duyệt sự kiện thành công!" : "Đã từ chối sự kiện!");
            fetchPendingEvents();
            fetchStats();
        } catch (error) {
            toast.error("Thao tác thất bại.");
        }
    };

    const handleResolveReport = async (reportId, isSpam) => {
        try {
            await axiosClient.put(`/reports/${reportId}/resolve?isSpam=${isSpam}`);
            toast.success(isSpam ? "Đã vô hiệu hóa nội dung theo Báo cáo." : "Đã bỏ qua báo cáo sai.");
            fetchReports();
        } catch (error) {
            toast.error("Xử lý báo cáo thất bại.");
        }
    };

    const handleUserStatus = async (userId, isActive) => {
        try {
            await axiosClient.put(`/users/${userId}/status?isActive=${isActive}`);
            toast.success(isActive ? "Đã mở khóa người dùng." : "Đã khóa người dùng thành công.");
            fetchUsers();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái người dùng.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bảng Điều Khiển Quản Trị</h1>
                    <p className="text-gray-500 mt-2">Quản lý toàn bộ nội dung và người dùng trên nền tảng</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng sự kiện</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalEvents}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <CheckSquare className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng lượt tham gia</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalParticipations}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Users className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng TNV / Người dùng</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    {/* Admin Tabs */}
                    <div className="flex border-b border-gray-100 px-6 pt-4 space-x-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'events' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className="flex items-center"><CheckSquare className="w-4 h-4 mr-2" /> Duyệt Sự Kiện</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reports' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className="flex items-center"><ShieldAlert className="w-4 h-4 mr-2" /> Xử lý Vi Phạm & Spam</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> Quản lý Người dùng</span>
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="p-6">

                        {/* EVENT APPROVALS */}
                        {activeTab === 'events' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Danh sách Sự kiện chờ duyệt</h2>
                                {isLoading ? <div className="text-center py-10 opacity-50">Đang tải...</div> : (
                                    <div className="space-y-4">
                                        {pendingEvents.length === 0 ? <p className="text-gray-500 py-4 text-center">Không có sự kiện mới nào cần duyệt.</p> : pendingEvents.map(evt => (
                                            <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{evt.title}</h3>
                                                    <div className="text-sm text-gray-500 mt-1 flex space-x-4">
                                                        <span>Người tạo: <span className="text-gray-700 font-medium">{evt.createdBy?.fullName || 'Ẩn danh'}</span></span>
                                                        <span>Ngày nộp: {format(new Date(evt.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 mt-4 sm:mt-0">
                                                    <button onClick={() => handleEventStatus(evt.id, 'APPROVED')} className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors">
                                                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Phê duyệt
                                                    </button>
                                                    <button onClick={() => handleEventStatus(evt.id, 'REJECTED')} className="flex items-center px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors">
                                                        <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* CONTENT REPORTS */}
                        {activeTab === 'reports' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Báo cáo Mới cần xử lý</h2>
                                {isLoading ? <div className="text-center py-10 opacity-50">Đang tải...</div> : (
                                    <div className="space-y-4">
                                        {reportedContent.length === 0 ? <p className="text-gray-500 py-4 text-center">Tất cả sạch bóng! Không có báo cáo vi phạm nào.</p> : reportedContent.map(rep => (
                                            <div key={rep.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-5 border border-red-100 bg-red-50/30 rounded-2xl">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                                                            Lý do: {rep.reason}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{format(new Date(rep.reportedAt), 'dd/MM/yyyy HH:mm')}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mt-2">Nội dung bị báo cáo: <span className="text-blue-600 hover:underline cursor-pointer">{rep.event?.title || 'Đã bị xoá'}</span></h3>
                                                    <p className="text-sm text-gray-500 mt-1">Nội dung chi tiết báo cáo: <span className="italic">{rep.description}</span></p>
                                                    <p className="text-sm text-gray-500">Người báo cáo: {rep.reporter?.email || 'Ẩn danh'}</p>
                                                </div>
                                                <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
                                                    <button onClick={() => handleResolveReport(rep.id, true)} className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer">
                                                        <Trash2 className="w-4 h-4 mr-1.5" /> Xóa nội dung
                                                    </button>
                                                    <button onClick={() => handleResolveReport(rep.id, false)} className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                                                        Bỏ qua (Báo cáo sai)
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* USER MANAGEMENT */}
                        {activeTab === 'users' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Quản lý Tài khoản</h2>
                                    <div className="relative">
                                        <input type="text" placeholder="Tìm email hoặc tên..." className="text-sm border border-gray-200 rounded-lg pl-3 pr-10 py-2 focus:ring-primary-500 focus:border-primary-500 w-64" />
                                    </div>
                                </div>
                                {isLoading ? <div className="text-center py-10 opacity-50">Đang tải...</div> : (
                                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                                        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map(u => (
                                                    <tr key={u.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random`} alt="" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="font-semibold text-gray-900">{u.fullName}</div>
                                                                    <div className="text-gray-500 text-xs">{u.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {u.isActive ? 'Hoạt động' : 'Đã Khóa'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {u.role !== 'ADMIN' && (
                                                                <button
                                                                    onClick={() => handleUserStatus(u.id, !u.isActive)}
                                                                    className={`text-sm ${u.isActive ? 'text-red-600 hover:text-red-900' : 'text-emerald-600 hover:text-emerald-900'} font-semibold underline cursor-pointer`}
                                                                >
                                                                    {u.isActive ? 'Báo vi phạm & Khóa' : 'Mở khóa'}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}