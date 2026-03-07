import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Calendar, MapPin, AlignLeft, Users, Zap, Image as ImageIcon, Send } from 'lucide-react';

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
        capacity: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axiosClient.post('/events', formData);
            toast.success("Tạo sự kiện thành công! Chờ Admin duyệt nhé.");
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data || "Lỗi khi tạo sự kiện. Vui lòng kiểm tra lại thông tin.";
            toast.error(typeof msg === 'string' ? msg : "Lỗi khi tạo sự kiện. Vui lòng kiểm tra lại thông tin.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4 shadow-sm border border-emerald-50">
                        <Zap className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Cùng tạo chiến dịch mới</h1>
                    <p className="text-gray-500 mt-3 text-lg">Mỗi hành động nhỏ đều có thể mang lại thay đổi lớn cho cộng đồng</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] shadow-xl border border-gray-100/60 p-6 sm:p-10 backdrop-blur-xl bg-white/90"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sự kiện <span className="text-red-500">*</span></label>
                            <input
                                required
                                name="title"
                                type="text"
                                className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-base font-medium text-gray-900 placeholder-gray-400"
                                placeholder="VD: Chiến dịch dọn sạch bãi biển Vũng Tàu..."
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Location and Capacity row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" /> Địa điểm <span className="text-red-500 ml-1">*</span></label>
                                <input
                                    required
                                    name="location"
                                    type="text"
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm text-gray-900"
                                    placeholder="Địa chỉ cụ thể hoặc Trực tuyến"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Users className="w-4 h-4 mr-1 text-gray-400" /> Số lượng TNV <span className="text-red-500 ml-1">*</span></label>
                                <input
                                    required
                                    name="capacity"
                                    type="number"
                                    min="1"
                                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all sm:text-sm text-gray-900"
                                    placeholder="Số lượng người tham gia tối đa"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Time row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-1 text-primary-500" /> Thời gian bắt đầu <span className="text-red-500 ml-1">*</span></label>
                                <input
                                    required
                                    name="startTime"
                                    type="datetime-local"
                                    className="block w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 transition-all text-sm text-gray-700"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-1 text-rose-500" /> Thời gian kết thúc <span className="text-red-500 ml-1">*</span></label>
                                <input
                                    required
                                    name="endTime"
                                    type="datetime-local"
                                    className="block w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 transition-all text-sm text-gray-700"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"><AlignLeft className="w-4 h-4 mr-1 text-gray-400" /> Mô tả chi tiết <span className="text-red-500 ml-1">*</span></label>
                            <textarea
                                required
                                name="description"
                                rows="5"
                                className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm text-gray-900 resize-none"
                                placeholder="Viết rõ lịch trình, công việc cần làm, yêu cầu đối với tình nguyện viên..."
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-emerald-500 hover:from-primary-700 hover:to-emerald-600 text-white p-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed transform"
                            >
                                <span>{isLoading ? 'Đang gửi yêu cầu...' : 'Đăng ký xuất bản sự kiện'}</span>
                                {!isLoading && <Send className="w-5 h-5 ml-2" />}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4">Sự kiện của bạn sẽ được đội ngũ Admin kiểm duyệt trước khi hiển thị công khai trên nền tảng.</p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
