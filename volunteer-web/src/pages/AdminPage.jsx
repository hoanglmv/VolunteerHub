import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // Import Navbar

export default function AdminPage() {
    const [stats, setStats] = useState({});
    const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', startTime: '', endTime: '' });

    useEffect(() => {
        // Gọi API Thống kê
        axiosClient.get('/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/events', newEvent);
            toast.success("Tạo sự kiện thành công!");
            setNewEvent({ title: '', description: '', location: '', startTime: '', endTime: '' }); // Reset form
        } catch (error) {
            toast.error("Lỗi tạo sự kiện");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Thanh menu nằm trên cùng */}
            <Navbar />

            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8 text-red-600">🛡️ Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-500 text-white p-6 rounded shadow-lg">
                        <h3 className="text-xl opacity-90">Tổng Users</h3>
                        <p className="text-4xl font-bold mt-2">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded shadow-lg">
                        <h3 className="text-xl opacity-90">Tổng Sự kiện</h3>
                        <p className="text-4xl font-bold mt-2">{stats.totalEvents || 0}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-6 rounded shadow-lg">
                        <h3 className="text-xl opacity-90">Lượt Tham gia</h3>
                        <p className="text-4xl font-bold mt-2">{stats.totalParticipations || 0}</p>
                    </div>
                </div>

                {/* Create Event Form */}
                <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto md:mx-0">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">✍️ Tạo sự kiện mới</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <input className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Tên sự kiện"
                               value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />

                        <textarea className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Mô tả chi tiết" rows="3"
                                  value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />

                        <input className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Địa điểm tổ chức"
                               value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 ml-1">Bắt đầu</label>
                                <input type="datetime-local" className="w-full border p-2 rounded"
                                       onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 ml-1">Kết thúc</label>
                                <input type="datetime-local" className="w-full border p-2 rounded"
                                       onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                            </div>
                        </div>
                        <button className="w-full bg-red-500 text-white px-6 py-3 rounded font-bold hover:bg-red-600 transition duration-200">
                            Đăng sự kiện
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}