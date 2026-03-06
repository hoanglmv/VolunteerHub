import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // Import Navbar

export default function HomePage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Gọi API Search để lấy list sự kiện
            const res = await axiosClient.get('/events/search?page=0&size=10');
            setEvents(res.data.content);
        } catch (error) {
            console.error(error);
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
        <div className="min-h-screen bg-gray-50">
            {/* Thanh menu nằm trên cùng */}
            <Navbar />

            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6 text-blue-700">🔥 Sự kiện Tình nguyện Mới nhất</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="border p-4 rounded shadow hover:shadow-lg bg-white transition duration-300">
                            <h2 className="text-xl font-bold text-blue-600">{event.title}</h2>
                            <p className="text-gray-600 text-sm mb-2">📍 {event.location}</p>
                            <p className="mb-4 text-gray-700">{event.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                    {new Date(event.startTime).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleJoin(event.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
                                >
                                    Tham gia ngay
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}