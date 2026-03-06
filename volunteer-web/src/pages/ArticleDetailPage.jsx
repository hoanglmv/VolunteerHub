import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, User, MessageCircle, Send } from 'lucide-react';

export default function ArticleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        fetchArticle();
        fetchComments();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get(`/articles/${id}`);
            setArticle(res.data);
        } catch (error) {
            toast.error("Không thể tải bài viết");
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axiosClient.get(`/articles/${id}/comments`);
            setComments(res.data || []);
        } catch (error) {
            console.error("Lỗi tải bình luận:", error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axiosClient.post(`/articles/${id}/comments`, {
                content: newComment
            });
            setComments([res.data, ...comments]); // Thêm bình luận mới lên đầu
            setNewComment("");
            toast.success("Đã gửi bình luận!");
        } catch (error) {
            toast.error("Vui lòng đăng nhập để bình luận.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* NỘI DUNG BÀI VIẾT */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {article.imageUrl && (
                        <div className="w-full h-[400px] overflow-hidden">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-8 sm:p-12">
                        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                            <span className="flex items-center text-primary-600 font-medium">
                                <User className="w-4 h-4 mr-1.5" />
                                {article.author?.fullName}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                {article.createdAt ? format(new Date(article.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                            {article.title}
                        </h1>

                        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>
                </motion.article>

                {/* PHẦN BÌNH LUẬN */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                        <MessageCircle className="w-6 h-6 mr-3 text-primary-500" />
                        Bình luận ({comments.length})
                    </h3>

                    {currentUser ? (
                        <form onSubmit={handlePostComment} className="mb-10 flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold shrink-0">
                                {currentUser.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none min-h-[100px]"
                                    placeholder="Chia sẻ suy nghĩ của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-10 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 text-center">
                            Vui lòng <a href="/login" className="font-bold underline">đăng nhập</a> để tham gia bình luận.
                        </div>
                    )}

                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center italic py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="flex space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.fullName || 'User')}&background=random`} alt="Avatar" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-gray-900">{comment.author?.fullName}</h4>
                                            <span className="text-xs text-gray-400">
                                                {comment.createdAt ? format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
