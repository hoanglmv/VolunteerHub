import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, CheckCircle2, XCircle, Clock, Users,
    ClipboardList, Filter, ExternalLink, Trash2, AlertCircle, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_TABS = [
    { key: 'ALL', label: 'Tất cả', icon: ClipboardList, color: 'primary' },
    { key: 'PENDING', label: 'Chờ duyệt', icon: Clock, color: 'yellow' },
    { key: 'CONFIRMED', label: 'Đã duyệt', icon: CheckCircle2, color: 'green' },
    { key: 'REJECTED', label: 'Từ chối', icon: XCircle, color: 'red' },
];

export default function MyEventsPage() {
    const [participations, setParticipations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        fetchMyParticipations();
    }, []);

    const fetchMyParticipations = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/participations/history?page=0&size=100');
            setParticipations(res.data.content || []);
        } catch (error) {
            toast.error("Không thể tải danh sách sự kiện của bạn.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRegistration = async (eventId, eventTitle) => {
        if (!window.confirm(`Bạn có chắc muốn hủy đăng ký sự kiện "${eventTitle}"?`)) return;
        try {
            await axiosClient.delete(`/participations/events/${eventId}`);
            toast.success("Đã hủy đăng ký thành công!");
            fetchMyParticipations();
        } catch (error) {
            toast.error(error.response?.data || "Hủy đăng ký thất bại.");
        }
    };

    const filtered = activeFilter === 'ALL'
        ? participations
        : participations.filter(p => p.status === activeFilter);

    const counts = {
        ALL: participations.length,
        PENDING: participations.filter(p => p.status === 'PENDING').length,
        CONFIRMED: participations.filter(p => p.status === 'CONFIRMED').length,
        REJECTED: participations.filter(p => p.status === 'REJECTED').length,
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return (
                    <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Đã duyệt
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Từ chối
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 mr-1.5" /> Chờ duyệt
                    </span>
                );
        }
    };

    const getTabColorClasses = (tabKey, isActive) => {
        const colors = {
            ALL: isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
            PENDING: isActive ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
            CONFIRMED: isActive ? 'bg-green-600 text-white shadow-md shadow-green-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
            REJECTED: isActive ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
        };
        return colors[tabKey];
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <ClipboardList className="w-8 h-8 mr-3 text-emerald-600" />
                        Hoạt động của tôi
                    </h1>
                    <p className="text-gray-500 mt-2">Theo dõi trạng thái đăng ký và các sự kiện bạn đã tham gia.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {STATUS_TABS.map(tab => {
                        const Icon = tab.icon;
                        const bgColors = { ALL: 'bg-emerald-50', PENDING: 'bg-yellow-50', CONFIRMED: 'bg-green-50', REJECTED: 'bg-red-50' };
                        const textColors = { ALL: 'text-emerald-600', PENDING: 'text-yellow-600', CONFIRMED: 'text-green-600', REJECTED: 'text-red-600' };
                        return (
                            <div key={tab.key} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className={`h-10 w-10 rounded-xl ${bgColors[tab.key]} flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 ${textColors[tab.key]}`} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">{counts[tab.key]}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 font-medium">{tab.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {STATUS_TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${getTabColorClasses(tab.key, isActive)}`}
                            >
                                <Icon className="w-4 h-4 mr-1.5" />
                                {tab.label}
                                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    {counts[tab.key]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Events List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            <p className="text-sm">Đang tải danh sách...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-700">Không có sự kiện nào</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {activeFilter === 'ALL'
                                    ? 'Bạn chưa đăng ký tham gia sự kiện nào.'
                                    : `Không có sự kiện nào ở trạng thái "${STATUS_TABS.find(t => t.key === activeFilter)?.label}".`
                                }
                            </p>
                            <Link to="/events" className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                                Khám phá sự kiện
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        {/* Left: Event Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {(p.event?.title || '?')[0].toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                                                        {p.event?.title || 'Sự kiện không xác định'}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                                            {p.event?.startTime ? format(new Date(p.event.startTime), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                                            {p.event?.location || 'Trực tuyến'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Status & Actions */}
                                        <div className="flex items-center space-x-3 mt-4 sm:mt-0 sm:ml-4">
                                            {getStatusBadge(p.status)}

                                            <div className="flex items-center space-x-1">
                                                {p.event?.id && (
                                                    <Link
                                                        to={`/events/${p.event.id}`}
                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}

                                                {p.status === 'PENDING' && p.event?.id && (
                                                    <button
                                                        onClick={() => handleCancelRegistration(p.event.id, p.event.title)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hủy đăng ký"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!isLoading && filtered.length > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Hiển thị {filtered.length} sự kiện {activeFilter !== 'ALL' ? `(lọc: ${STATUS_TABS.find(t => t.key === activeFilter)?.label})` : ''}
                    </p>
                )}
            </div>
        </div>
    );
}
