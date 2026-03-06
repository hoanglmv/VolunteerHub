import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, ArrowLeft, Heart, MessageCircle, Send, User as UserIcon, AlertTriangle, X } from 'lucide-react';

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);

    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        fetchEvent();
        fetchPosts();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await axiosClient.get(`/events/${id}`);
            setEvent(res.data);
        } catch (error) {
            toast.error("Không tìm thấy sự kiện");
            navigate('/events');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await axiosClient.get(`/social/events/${id}/posts?page=0&size=20`);
            setPosts(res.data.content || []);
        } catch (error) {
            console.error("Lỗi tải bảng tin:", error);
        }
    };

    const handleJoin = async () => {
        try {
            await axiosClient.post(`/participations/events/${id}`);
            toast.success("Đăng ký tham gia thành công! Chờ duyệt nhé.");
        } catch (error) {
            toast.error(error.response?.data || "Lỗi đăng ký");
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const res = await axiosClient.post(`/social/events/${id}/posts`, {
                content: newPost,
                image: ""
            });
            setPosts([res.data, ...posts]);
            setNewPost("");
            toast.success("Đã đăng bài viết!");
        } catch (error) {
            toast.error("Lỗi đăng bài viết.");
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            await axiosClient.post(`/social/posts/${postId}/like`);
            // Refresh posts to update like counts
            fetchPosts();
        } catch (error) {
            toast.error("Vui lòng đăng nhập để thả tim.");
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        if (!reportReason.trim()) {
            toast.error("Vui lòng nhập lý do báo cáo");
            return;
        }

        try {
            setIsReporting(true);
            const res = await axiosClient.post(`/reports/events/${id}`, { reason: reportReason });
            toast.success(res.data || "Đã gửi báo cáo thành công!");
            setIsReportModalOpen(false);
            setReportReason("");
        } catch (error) {
            toast.error(error.response?.data || "Lỗi khi gửi báo cáo");
        } finally {
            setIsReporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!event) return null;

    const defaultImage = `https://images.unsplash.com/photo-1593113514210-9bfa780d3810?q=80&w=1200&auto=format&fit=crop`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Image */}
            <div className="w-full h-64 md:h-96 relative">
                <img
                    src={event.imageUrl || defaultImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white transition-all"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 lg:left-20 text-white max-w-4xl pr-4">
                    <span className="px-3 py-1 bg-primary-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        {event.status === 'PUBLISHED' ? 'Đang mở đăng ký' : 'Tình trạng: ' + event.status}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2">
                        {event.title}
                    </h1>
                    <p className="text-gray-200 flex items-center mt-2">
                        <MapPin className="w-5 h-5 mr-2" /> {event.location}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 flex flex-col lg:flex-row gap-8">

                {/* Lft Column (Event Details) */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Thông tin sự kiện</h3>

                        <div className="space-y-5">
                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flexItems-center justify-center text-blue-600 mr-4 shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Thời gian diễn ra</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Bắt đầu: {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Kết thúc: {format(new Date(event.endTime), 'dd/MM/yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mr-4 shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Số lượng tham gia</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Tối đa {event.maxParticipants > 0 ? event.maxParticipants : 'Không giới hạn'} người
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full mt-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1"
                        >
                            Đăng Ký Tham Gia
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Ban tổ chức</h3>
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold mr-4 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.createdBy?.fullName || 'T')}&background=random`} alt="Avatar" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{event.createdBy?.fullName || 'Tổ chức ẩn danh'}</p>
                                <p className="text-xs text-gray-500 mt-1">Trưởng đoàn / Điều phối viên</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Description & Social Wall) */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    {/* Description */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Mô tả chi tiết</h2>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors group"
                            >
                                <AlertTriangle className="w-4 h-4 mr-1.5 group-hover:animate-pulse" />
                                Báo cáo vi phạm
                            </button>
                        </div>
                        <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {event.description}
                        </div>
                    </div>

                    {/* Social Wall / Discussion Board */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                            <MessageCircle className="w-6 h-6 mr-3 text-primary-500" />
                            Bảng tin & Thảo luận
                        </h2>
                        <p className="text-gray-500 mb-8">Nơi tình nguyện viên cập nhật hình ảnh và trao đổi thông tin chiến dịch.</p>

                        {/* Post Box */}
                        {currentUser ? (
                            <form onSubmit={handleCreatePost} className="mb-10 flex items-start space-x-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold shrink-0">
                                    {currentUser.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        className="w-full p-3 bg-transparent border-none focus:ring-0 outline-none resize-none min-h-[80px]"
                                        placeholder="Bạn muốn chia sẻ điều gì về sự kiện này?"
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end pt-2 border-t border-gray-200 mt-2">
                                        <button
                                            type="submit"
                                            disabled={!newPost.trim()}
                                            className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                                        >
                                            <Send className="w-4 h-4 mr-2" /> Đăng bài
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="mb-10 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 text-center">
                                Vui lòng <a href="/login" className="font-bold underline">đăng nhập</a> để tham gia thảo luận.
                            </div>
                        )}

                        {/* Posts List */}
                        <div className="space-y-6">
                            {posts.length === 0 ? (
                                <p className="text-gray-500 text-center italic py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    Chưa có cập nhật nào trên bảng tin. Hãy là người đầu tiên!
                                </p>
                            ) : (
                                posts.map(post => (
                                    <div key={post.id} className="p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.fullName || 'User')}&background=random`} alt="Avatar" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{post.user?.fullName}</h4>
                                                    <span className="text-xs text-gray-400">
                                                        {post.createdAt ? format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

                                        {post.image && (
                                            <img src={post.image} alt="Dinh kem" className="rounded-xl w-full max-h-96 object-cover mb-4 border border-gray-100" />
                                        )}

                                        <div className="flex items-center space-x-6 border-t border-gray-50 pt-3">
                                            <button
                                                onClick={() => handleToggleLike(post.id)}
                                                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-rose-500 transition-colors group cursor-pointer"
                                            >
                                                <Heart className="w-5 h-5 group-hover:fill-rose-500" />
                                                <span className="font-medium">{post.likesCount || 0}</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="font-medium">{post.commentsCount || 0} Bình luận</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                            <h3 className="text-xl font-bold flex items-center text-red-700">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Báo cáo Sự kiện
                            </h3>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleReport} className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Nếu bạn phát hiện sự kiện này vi phạm tiêu chuẩn cộng đồng, lừa đảo, hoặc có nội dung nhạy cảm, vui lòng cho chúng tôi biết.
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lý do báo cáo <span className="text-red-500">*</span></label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-all"
                                rows="4"
                                placeholder="Viết lý do chi tiết..."
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                autoFocus
                            ></textarea>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={!reportReason.trim() || isReporting}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center shadow-sm shadow-red-600/20"
                                >
                                    {isReporting ? 'Đang gửi...' : 'Gửi báo cáo'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
