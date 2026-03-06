import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, User, Star, Heart } from 'lucide-react';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axiosClient.get('/participations/leaderboard');
            setLeaderboard(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy bảng xếp hạng", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get Gamification Rank based on totalEvents
    const getBadgeInfo = (totalEvents) => {
        if (totalEvents === 0) return { name: "Thành viên mới", color: "text-gray-500", bg: "bg-gray-100", icon: <User className="w-4 h-4 mr-1" /> };
        if (totalEvents <= 3) return { name: "Trái tim Đồng", color: "text-amber-700", bg: "bg-amber-100", icon: <Heart className="w-4 h-4 mr-1" /> };
        if (totalEvents <= 10) return { name: "Trái tim Bạc", color: "text-gray-500", bg: "bg-gray-200", icon: <Star className="w-4 h-4 mr-1" /> };
        return { name: "Trái tim Vàng", color: "text-yellow-600", bg: "bg-yellow-100", icon: <Award className="w-4 h-4 mr-1" /> };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full shadow-lg mb-6"
                    >
                        <Trophy className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Bảng Vàng Tình Nguyện</h1>
                    <p className="text-gray-500 mt-3 text-lg">Tôn vinh những cá nhân đóng góp tích cực nhất cho cộng đồng</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 grid grid-cols-12 gap-4">
                        <div className="col-span-2 md:col-span-1 text-center font-bold text-gray-500 uppercase text-xs">Hạng</div>
                        <div className="col-span-7 md:col-span-8 font-bold text-gray-500 uppercase text-xs">Tình nguyện viên</div>
                        <div className="col-span-3 text-right font-bold text-gray-500 uppercase text-xs">Hoàn thành</div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {leaderboard.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">Chưa có dữ liệu tình nguyện.</div>
                        ) : (
                            leaderboard.map((item, index) => {
                                const rank = index + 1;
                                const isTop3 = rank <= 3;
                                const badgeInfo = getBadgeInfo(item.totalEvents);

                                return (
                                    <motion.div
                                        key={item.user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors ${rank === 1 ? 'bg-yellow-50/30' : ''}`}
                                    >
                                        <div className="col-span-2 md:col-span-1 flex justify-center">
                                            {rank === 1 ? <Medal className="w-8 h-8 text-yellow-500 drop-shadow-sm" /> :
                                                rank === 2 ? <Medal className="w-8 h-8 text-gray-400 drop-shadow-sm" /> :
                                                    rank === 3 ? <Medal className="w-8 h-8 text-amber-600 drop-shadow-sm" /> :
                                                        <span className="text-lg font-bold text-gray-400">{rank}</span>}
                                        </div>

                                        <div className="col-span-7 md:col-span-8 flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden shrink-0 shadow-sm bg-gray-100">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.fullName)}&background=random&bold=true`}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-gray-900 ${isTop3 ? 'text-lg' : ''}`}>{item.user.fullName}</h3>
                                                <div className="flex items-center mt-1">
                                                    <span className={`text-xs font-semibold flex items-center px-2 py-0.5 rounded-md ${badgeInfo.bg} ${badgeInfo.color}`}>
                                                        {badgeInfo.icon} {badgeInfo.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-3 flex justify-end items-center">
                                            <div className="text-center">
                                                <span className={`text-2xl font-black ${isTop3 ? 'text-primary-600' : 'text-gray-700'}`}>{item.totalEvents}</span>
                                                <span className="block text-xs text-gray-400 font-medium">sự kiện</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
