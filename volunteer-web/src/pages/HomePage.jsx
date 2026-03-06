import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Search, Compass, Heart } from 'lucide-react';
import EventCard from '../components/EventCard';

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const res = await axiosClient.get('/events/search?page=0&size=12');
            setEvents(res.data.content || []);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sự kiện");
        } finally {
            setIsLoading(false);
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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary-900 border-b border-primary-800">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-white mb-6">
                            Kết nối tấm lòng, <br className="hidden sm:block" />
                            <span className="text-primary-400">Chung tay hành động</span>
                        </h1>
                        <p className="mt-4 text-xl text-primary-100 mb-10 leading-relaxed">
                            Khám phá hàng ngàn cơ hội thiện nguyện trên khắp cả nước. Bạn đã sẵn sàng để tạo ra những thay đổi tích cực cho cộng đồng hôm nay chưa?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-full font-semibold text-lg transition-colors shadow-lg shadow-primary-500/30">
                                Khám phá Sự kiện
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 rounded-full font-semibold text-lg transition-colors">
                                Trở thành Tình nguyện viên
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {/* News Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6 mt-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="bg-rose-100 text-rose-600 p-2 rounded-xl"><Heart className="h-6 w-6" /></span>
                                Tin tức hôm nay
                            </h2>
                            <p className="text-gray-500 mt-1 text-sm">Cập nhật tin tức mới nhất về các chiến dịch tình nguyện</p>
                        </div>
                        <button className="hidden sm:block px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                            Xem thêm tin tức
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dummy News Item 1 */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1593113565214-80afcb4a428a?auto=format&fit=crop&q=80&w=800" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">Môi trường</span>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">Hơn 500 TNV ra quân dọn rác bãi biển Vũng Tàu cuối tuần qua</h3>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">Một nỗ lực tuyệt vời từ cộng đồng khi thu gom được hơn 2 tấn rác thải nhựa...</p>
                            </div>
                        </div>

                        {/* Dummy News Item 2 */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-3 inline-block">Giáo dục</span>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">Khai giảng lớp học tình thương cho trẻ em vùng cao</h3>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">Mang con chữ đến với trẻ em nghèo, xây dựng tương lai tươi sáng hơn...</p>
                            </div>
                        </div>

                        {/* Dummy News Item 3 (Hidden on MD) */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all hidden lg:block">
                            <div className="h-48 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md mb-3 inline-block">Cộng đồng</span>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">Phát động chiến dịch Hiến máu nhân đạo mùa Hè 2026</h3>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">Mỗi giọt máu cho đi, một cuộc đời ở lại. Tham gia ngay tại điểm hiến máu gần nhất.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Events Section */}
                <main>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Compass className="h-8 w-8 text-primary-500" />
                                Hoạt động Nổi bật
                            </h2>
                            <p className="text-gray-500 mt-2">Đăng ký tham gia ngay các sự kiện đang hot nhất</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/events'}
                            className="hidden lg:flex items-center gap-2 text-sm text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                            Khám phá tất cả <Heart className="h-4 w-4" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <EventCard event={event} onJoin={handleJoin} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}