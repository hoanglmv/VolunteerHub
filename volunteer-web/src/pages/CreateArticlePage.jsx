import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Image as ImageIcon, FileText, Send, Type } from 'lucide-react';

export default function CreateArticlePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) return toast.error("Vui lòng nhập tiêu đề");
        if (!formData.content.trim()) return toast.error("Nội dung không được để trống");

        try {
            setIsSubmitting(true);
            const res = await axiosClient.post('/articles', formData);
            toast.success("Đăng bài viết thành công!");
            navigate(`/news/${res.data.id}`);
        } catch (error) {
            toast.error(error.response?.data || "Đăng bài viết thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl mr-4">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Viết bài mới</h1>
                            <p className="text-sm text-gray-500 mt-1">Chia sẻ câu chuyện tình nguyện của bạn với cộng đồng.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Type className="w-4 h-4 mr-2" /> Tiêu đề bài viết
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-lg font-medium"
                                placeholder="Nhập tiêu đề thật hấp dẫn..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <ImageIcon className="w-4 h-4 mr-2" /> Đường link Ảnh bìa (tuỳ chọn)
                            </label>
                            <input
                                type="url"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                            {formData.imageUrl && (
                                <div className="mt-4 rounded-xl overflow-hidden h-48 border border-gray-100 shadow-inner">
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nội dung chi tiết
                            </label>
                            <textarea
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none min-h-[300px]"
                                placeholder="Nội dung bài viết..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 mr-4 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-500/30 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                ) : (
                                    <Send className="w-5 h-5 mr-2 -ml-1" />
                                )}
                                Xuất bản bài viết
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
