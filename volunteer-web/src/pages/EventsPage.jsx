import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Filter, Search, Grid, List as ListIcon } from 'lucide-react';
import EventCard from '../components/EventCard';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchKeyword, setSearchKeyword] = useState('');

    // Fake categories for UI design. 
    // In a real DB, you might fetch these, but here we map them to the `keyword` filter or a specific column.
    const categories = ['All', 'Môi trường', 'Giáo dục', 'Y tế', 'Hỗ trợ thảm họa', 'Bảo vệ Động vật'];

    useEffect(() => {
        fetchEvents();
    }, [activeCategory]);

    const fetchEvents = async (keywordOverride = null) => {
        try {
            setIsLoading(true);
            const keyword = keywordOverride !== null ? keywordOverride : searchKeyword;

            // If activeCategory is not 'All', we append it to the keyword search (simple workaround without modifying backend schema again)
            let finalKeyword = keyword;
            if (activeCategory !== 'All') {
                finalKeyword = keyword ? `${keyword} ${activeCategory}` : activeCategory;
            }

            const queryParams = new URLSearchParams();
            queryParams.append('page', '0');
            queryParams.append('size', '50');
            if (finalKeyword) queryParams.append('keyword', finalKeyword);

            const res = await axiosClient.get(`/events/search?${queryParams.toString()}`);
            setEvents(res.data.content || []);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sự kiện");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            fetchEvents(searchKeyword);
        }
    };

    const handleJoin = async (eventId) => {
        try {
            await axiosClient.post(`/participations/events/${eventId}`);
            toast.success("Đăng ký tham gia thành công! Chờ duyệt nhé.");
        } catch (error) {
            toast.error(error.response?.data || "Lỗi đăng ký");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Khám phá Hoạt động</h1>
                        <p className="text-gray-500 mt-2">Tìm kiếm các dự án Tình nguyện phù hợp với sở thích của bạn</p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Nhập tên sự kiện (Enter)..."
                            className="pl-11 pr-4 py-3 w-full rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm shadow-sm"
                        />
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                </div>

                {/* Categories & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex overflow-x-auto w-full no-scrollbar space-x-2 p-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                            >
                                {cat === 'All' ? 'Tất cả lĩnh vực' : cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 px-2 hidden sm:flex">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Grid className="w-5 h-5" /></button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><ListIcon className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-4 h-4 mr-2" /> Lọc
                        </button>
                    </div>
                </div>

                {/* Event Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sự kiện nào</h3>
                        <p className="text-gray-500 mt-2">Hãy thử đổi từ khóa hoặc bộ lọc khác nhé.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <EventCard event={event} onJoin={handleJoin} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
