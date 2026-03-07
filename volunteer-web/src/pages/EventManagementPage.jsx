import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { Users, CheckCircle, XCircle, ListTodo, MessageSquare, Send, Bell, Plus, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function EventManagementPage() {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('members');
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dữ liệu Tabs
    const [participants, setParticipants] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [messages, setMessages] = useState([]);

    // States cho form Tạo Task
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedToUserId: '' });

    // States cho Chat
    const [newMessage, setNewMessage] = useState('');
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // State cho Broadcast
    const [broadcastMsg, setBroadcastMsg] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    useEffect(() => {
        if (!event) return;

        if (activeTab === 'members') fetchParticipants();
        if (activeTab === 'tasks') fetchTasks();
        if (activeTab === 'chat') {
            fetchMessages();
            connectWebSocket();
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [activeTab, event]);

    useEffect(() => {
        if (activeTab === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeTab]);

    const fetchEventDetails = async () => {
        try {
            const res = await axiosClient.get(`/events/${eventId}`);
            setEvent(res.data);

            // Chỉ người tạo sự kiện mới được vào trang này
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            if (res.data.createdBy?.id !== userId && localStorage.getItem('role') !== 'ADMIN') {
                toast.error("Bạn không có quyền quản lý sự kiện này");
                navigate(`/events/${eventId}`);
            }
        } catch (error) {
            toast.error("Không tải được thông tin sự kiện");
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    // --- Tab 1: Members ---
    const fetchParticipants = async () => {
        try {
            const res = await axiosClient.get(`/manage/events/${eventId}/participants`);
            setParticipants(res.data);
        } catch (error) {
            toast.error("Lỗi tải danh sách thành viên");
        }
    };

    const handleApproveReject = async (participationId, isApprove) => {
        try {
            const endpoint = isApprove ? 'approve' : 'reject';
            await axiosClient.post(`/manage/events/participants/${participationId}/${endpoint}`);
            toast.success(isApprove ? "Đã duyệt thành viên!" : "Đã từ chối đơn đăng ký");
            fetchParticipants(); // Reload
        } catch (error) {
            toast.error("Lỗi khi xử lý đơn đăng ký");
        }
    };

    // --- Tab 2: Tasks ---
    const fetchTasks = async () => {
        try {
            const res = await axiosClient.get(`/tasks/event/${eventId}`);
            setTasks(res.data);
        } catch (error) {
            toast.error("Lỗi tải danh sách công việc");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            await axiosClient.post(`/tasks/event/${eventId}/creator/${userId}`, newTask);
            toast.success("Tạo công việc thành công!");
            setIsCreatingTask(false);
            setNewTask({ title: '', description: '', dueDate: '', assignedToUserId: '' });
            fetchTasks(); // Reload
        } catch (error) {
            toast.error("Lỗi khi tạo công việc");
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            await axiosClient.put(`/tasks/${taskId}/status`, { status: newStatus });
            toast.success("Đã cập nhật trạng thái");
            fetchTasks();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Bạn có chắc chắn muốn xóa công việc này?")) return;
        try {
            await axiosClient.delete(`/tasks/${taskId}`);
            toast.success("Đã xóa công việc");
            fetchTasks();
        } catch (error) {
            toast.error("Lỗi khi xóa công việc");
        }
    }

    // --- Tab 3: Chat ---
    const fetchMessages = async () => {
        try {
            // Sửa lại theo controller mới
            const res = await axiosClient.get(`/api/chat/events/${eventId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Lỗi tải tin nhắn", error);
        }
    };

    const connectWebSocket = () => {
        if (stompClientRef.current?.active) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/event/${eventId}`, (message) => {
                    const newMsg = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMsg]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !stompClientRef.current?.active) return;

        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        stompClientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({
                content: newMessage,
                senderId: userId,
                eventId: eventId
            })
        });
        setNewMessage('');
    };

    // --- Tab 4: Broadcast ---
    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastMsg.trim()) return;
        try {
            await axiosClient.post(`/manage/events/${eventId}/broadcast`, broadcastMsg, {
                headers: { 'Content-Type': 'text/plain' }
            });
            toast.success("Đã gửi thông báo đến tất cả thành viên!");
            setBroadcastMsg('');
        } catch (error) {
            toast.error("Lỗi khi gửi thông báo");
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;
    if (!event) return null;

    const confirmedParticipants = participants.filter(p => p.status === 'CONFIRMED');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button onClick={() => navigate(`/events/${eventId}`)} className="p-2 hover:bg-gray-100 rounded-lg mr-4 text-gray-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý: {event.title}</h1>
                    <p className="text-gray-500 text-sm">Dashboard dành cho ban tổ chức</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-100 flex-shrink-0">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'members' ? 'bg-primary-600 text-white font-medium shadow-md shadow-primary-500/20' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}
                        >
                            <Users className="w-5 h-5 mr-3" /> Thành viên
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'tasks' ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-500/20' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}
                        >
                            <ListTodo className="w-5 h-5 mr-3" /> Công việc
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}
                        >
                            <MessageSquare className="w-5 h-5 mr-3" /> Ban điều hành
                        </button>
                        <button
                            onClick={() => setActiveTab('broadcast')}
                            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'broadcast' ? 'bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}
                        >
                            <Bell className="w-5 h-5 mr-3" /> Gửi thông báo
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">

                    {/* --- TAB: MEMBERS --- */}
                    {activeTab === 'members' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <Users className="mr-2 text-primary-500 w-6 h-6" /> Quản lý Người đăng ký
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                            <th className="p-4 rounded-tl-xl">Họ tên</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Ngày ĐK</th>
                                            <th className="p-4">Trạng thái</th>
                                            <th className="p-4 rounded-tr-xl text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {participants.length === 0 ? (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Chưa có ai đăng ký tham gia.</td></tr>
                                        ) : participants.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium">{p.user?.fullName}</td>
                                                <td className="p-4 text-gray-500">{p.user?.email}</td>
                                                <td className="p-4 text-gray-500">{format(new Date(p.registeredAt), 'dd/MM/yyyy')}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${p.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                                                            p.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {p.status === 'PENDING' && (
                                                        <div className="flex justify-end space-x-2">
                                                            <button onClick={() => handleApproveReject(p.id, true)} className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors" title="Duyệt">
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleApproveReject(p.id, false)} className="p-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Từ chối">
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: TASKS --- */}
                    {activeTab === 'tasks' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center">
                                    <ListTodo className="mr-2 text-emerald-500 w-6 h-6" /> Phân công Công việc
                                </h2>
                                {!isCreatingTask && (
                                    <button
                                        onClick={() => setIsCreatingTask(true)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mr-1" /> Thêm công việc
                                    </button>
                                )}
                            </div>

                            {isCreatingTask && (
                                <form onSubmit={handleCreateTask} className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-8">
                                    <h3 className="font-bold mb-4 text-emerald-900">Tạo công việc mới</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium mb-1">Tên công việc *</label>
                                            <input required type="text" className="w-full p-2.5 rounded-lg border border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium mb-1">Hạn hoàn thành</label>
                                            <input type="datetime-local" className="w-full p-2.5 rounded-lg border border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Mô tả</label>
                                        <textarea className="w-full p-2.5 rounded-lg border border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500" rows="2" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm text-gray-700 font-medium mb-1">Giao cho thành viên</label>
                                        <select className="w-full p-2.5 rounded-lg border border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500" value={newTask.assignedToUserId} onChange={e => setNewTask({ ...newTask, assignedToUserId: e.target.value })}>
                                            <option value="">-- Chưa giao cho ai --</option>
                                            {confirmedParticipants.map(p => (
                                                <option key={p.user.id} value={p.user.id}>{p.user.fullName} ({p.user.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" onClick={() => setIsCreatingTask(false)} className="px-5 py-2 text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors">Hủy</button>
                                        <button type="submit" className="px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors">Lưu công việc</button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Cột To Do */}
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 h-fit">
                                    <h3 className="font-bold text-gray-600 uppercase tracking-wide text-sm mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
                                        Cần làm <span className="bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'TODO').length}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {tasks.filter(t => t.status === 'TODO').map(t => (
                                            <TaskCard key={t.id} task={t} onUpdate={handleUpdateTaskStatus} onDelete={handleDeleteTask} />
                                        ))}
                                    </div>
                                </div>
                                {/* Cột In Progress */}
                                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 h-fit">
                                    <h3 className="font-bold text-blue-800 uppercase tracking-wide text-sm mb-4 flex items-center justify-between border-b border-blue-200 pb-2">
                                        Đang làm <span className="bg-blue-200 text-blue-800 py-0.5 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {tasks.filter(t => t.status === 'IN_PROGRESS').map(t => (
                                            <TaskCard key={t.id} task={t} onUpdate={handleUpdateTaskStatus} onDelete={handleDeleteTask} />
                                        ))}
                                    </div>
                                </div>
                                {/* Cột Done */}
                                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 h-fit">
                                    <h3 className="font-bold text-emerald-800 uppercase tracking-wide text-sm mb-4 flex items-center justify-between border-b border-emerald-200 pb-2">
                                        Đã xong <span className="bg-emerald-200 text-emerald-800 py-0.5 px-2 rounded-full text-xs">{tasks.filter(t => t.status === 'DONE').length}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {tasks.filter(t => t.status === 'DONE').map(t => (
                                            <TaskCard key={t.id} task={t} onUpdate={handleUpdateTaskStatus} onDelete={handleDeleteTask} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: CHAT --- */}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-full">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <MessageSquare className="mr-2 text-blue-500 w-6 h-6" /> Ban Điều Hành & Thành Viên
                            </h2>
                            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 overflow-y-auto p-4 mb-4" style={{ maxHeight: '400px', minHeight: '300px' }}>
                                {messages.length === 0 ? (
                                    <div className="flex items-center justify-center p-10 h-full text-gray-400 italic">
                                        Chưa có tin nhắn nào. Bắt đầu phiên trò chuyện!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => {
                                            const isMe = msg.senderId === JSON.parse(localStorage.getItem('user'))?.id;
                                            return (
                                                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <span className="text-xs text-gray-500 mb-1 px-1">{msg.senderFullName}</span>
                                                    <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                            <form onSubmit={sendMessage} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    className="flex-1 p-3.5 pl-4 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                    <Send className="w-5 h-5 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* --- TAB: BROADCAST --- */}
                    {activeTab === 'broadcast' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <Bell className="mr-2 text-amber-500 w-6 h-6" /> Thông báo toàn đoàn
                            </h2>
                            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                                <p className="text-amber-800 mb-4 text-sm">
                                    Tin nhắn này sẽ được gửi vào mục Thông báo của tất cả <b>{confirmedParticipants.length} thành viên</b> đã được duyệt tham gia sự kiện.
                                </p>
                                <form onSubmit={handleBroadcast}>
                                    <textarea
                                        className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mb-4 min-h-[120px]"
                                        placeholder="Nhập nội dung thông báo quan trọng (vd: Thay đổi địa điểm, nhắc nhở mang đồ...)"
                                        value={broadcastMsg}
                                        onChange={e => setBroadcastMsg(e.target.value)}
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={!broadcastMsg.trim() || confirmedParticipants.length === 0}
                                        className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/30 disabled:opacity-50 flex items-center"
                                    >
                                        <Send className="w-5 h-5 mr-2" /> Phát thông báo
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// Sub-component cho Task Card
function TaskCard({ task, onUpdate, onDelete }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <button onClick={() => onDelete(task.id)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <XCircle className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{task.title}</h4>
            {task.description && <p className="text-xs text-gray-500 mb-3 truncate">{task.description}</p>}

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
                {task.assignedToFullName ? (
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 p-1.5 rounded-md">
                        <Users className="w-3.5 h-3.5 mr-1" /> {task.assignedToFullName}
                    </div>
                ) : (
                    <div className="text-xs text-amber-600 bg-amber-50 p-1.5 rounded-md font-medium">Chưa giao</div>
                )}

                {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" /> {format(new Date(task.dueDate), 'dd/MM HH:mm')}
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-1">
                {task.status !== 'TODO' && (
                    <button onClick={() => onUpdate(task.id, 'TODO')} className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors">Todo</button>
                )}
                {task.status !== 'IN_PROGRESS' && (
                    <button onClick={() => onUpdate(task.id, 'IN_PROGRESS')} className="flex-1 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition-colors">Đang làm</button>
                )}
                {task.status !== 'DONE' && (
                    <button onClick={() => onUpdate(task.id, 'DONE')} className="flex-1 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded transition-colors">Xong</button>
                )}
            </div>
        </div>
    );
}
