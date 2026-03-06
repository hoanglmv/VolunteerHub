import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Flag, CheckCircle2, XCircle, Trash2, ShieldAlert, CheckSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events'); // events, reports, users
    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, pendingEvents: 0, pendingReports: 0 });

    const [pendingEvents, setPendingEvents] = useState([]);
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            console.error("Lỗi tải thống kê", error);
        }
    };

    const fetchPendingEvents = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/events/pending');
            setPendingEvents(res.data || []);
        } catch (error) {
            toast.error("Không thể tải Sự kiện chờ duyệt");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/reports?status=PENDING&size=20');
            setReports(res.data.content || []);
        } catch (error) {
            toast.error("Không thể tải Báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const query = userSearch ? `?keyword=${encodeURIComponent(userSearch)}&size=50` : '?size=50';
            const res = await axiosClient.get(`/users${query}`);
            setUsers(res.data.content || []);
        } catch (error) {
            toast.error("Không thể tải Danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventStatus = async (eventId, status) => {
        try {
            await axiosClient.put(`/events/${eventId}/status?status=${status}`);
            toast.success(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} sự kiện!`);
            fetchPendingEvents();
            fetchStats();
        } catch (error) {
            toast.error("Lỗi khi xử lý sự kiện");
        }
    };

    const handleReport = async (reportId, isSpam) => {
        try {
            await axiosClient.put(`/reports/${reportId}/resolve?isSpam=${isSpam}`);
            toast.success(isSpam ? 'Đã xóa sự kiện vi phạm!' : 'Đã bỏ qua báo cáo!');
            fetchReports();
            fetchStats();
        } catch (error) {
            toast.error("Lỗi xử lý báo cáo");
        }
    };

    const handleUserSearch = (e) => {
        setUserSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            fetchUsers();
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
                            <p className="text-sm font-medium text-gray-500">Sự kiện chờ duyệt</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingEvents}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                            <Flag className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Báo cáo vi phạm</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingReports}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Users className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
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
                        {isLoading && (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        )}

                        {/* EVENT APPROVALS */}
                        {!isLoading && activeTab === 'events' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Danh sách Sự kiện chờ duyệt</h2>
                                {pendingEvents.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">Chưa có sự kiện nào chờ duyệt.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingEvents.map(evt => (
                                            <div key={evt.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{evt.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{evt.description}</p>
                                                    <div className="text-xs text-gray-500 mt-2 flex space-x-4">
                                                        <span>Người tạo: <span className="font-medium text-gray-700">{evt.createdBy?.fullName || 'Ẩn danh'}</span></span>
                                                        <span>Bắt đầu: {format(new Date(evt.startTime), 'dd/MM/yyyy HH:mm')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0">
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
                        {!isLoading && activeTab === 'reports' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-lg font-bold text-red-600 mb-4">Báo cáo Mới cần xử lý</h2>
                                {reports.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">Không có báo cáo vi phạm mới.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {reports.map(rep => (
                                            <div key={rep.id} className="flex flex-col md:flex-row md:items-start justify-between p-5 border border-red-100 bg-red-50/30 rounded-2xl">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                                                            {rep.reason}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{format(new Date(rep.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mt-2">Nội dung báo cáo (Sự kiện): <span className="text-blue-600">{rep.event?.title || 'Đã bị xóa'}</span></h3>
                                                    <p className="text-sm text-gray-700 mt-1 italic">"{rep.details}"</p>
                                                    <p className="text-xs text-gray-500 mt-2">Người báo cáo: {rep.reportedBy?.email || 'N/A'}</p>
                                                </div>
                                                <div className="flex flex-col space-y-2 mt-4 md:mt-0 flex-shrink-0">
                                                    <button onClick={() => handleReport(rep.id, true)} className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                                                        <Trash2 className="w-4 h-4 mr-1.5" /> Xác nhận & Xóa Sự Kiện
                                                    </button>
                                                    <button onClick={() => handleReport(rep.id, false)} className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">
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
                        {!isLoading && activeTab === 'users' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                    <h2 className="text-lg font-bold text-gray-900">Quản lý Tài khoản</h2>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={userSearch}
                                            onChange={handleUserSearch}
                                            onKeyDown={handleSearchSubmit}
                                            placeholder="Tìm email hoặc tên (Enter)..."
                                            className="text-sm border border-gray-200 rounded-lg pl-3 pr-10 py-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                                        />
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase mr-3">
                                                                {u.fullName?.charAt(0) || u.email?.charAt(0)}
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">{u.fullName || 'Chưa cập nhật'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {u.createdAt ? format(new Date(u.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Không tìm thấy người dùng nào.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}