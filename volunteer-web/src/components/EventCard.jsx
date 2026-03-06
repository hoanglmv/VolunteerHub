import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const EventCard = ({ event, onJoin }) => {
    // Generate a placeholder image based on the event ID or title if imageUrl is missing
    const defaultImage = `https://images.unsplash.com/photo-1593113514210-9bfa780d3810?q=80&w=800&auto=format&fit=crop`;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={event.imageUrl || defaultImage}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-600 shadow-sm">
                    {event.status === 'PUBLISHED' ? 'Đang mở' : 'Khép kín'}
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                    {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {event.description}
                </p>

                <div className="space-y-2 mt-auto mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-primary-500 shrink-0" />
                        <span>{format(new Date(event.startTime), 'dd/MM/yyyy • HH:mm')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500 shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    {event.maxParticipants > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-2 text-primary-500 shrink-0" />
                            <span>Tối đa {event.maxParticipants} người</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onJoin(event.id)}
                    className="w-full mt-auto flex items-center justify-center space-x-2 bg-gray-50 hover:bg-primary-600 text-gray-700 hover:text-white font-medium py-2.5 rounded-xl border border-gray-100 hover:border-primary-600 transition-colors group/btn"
                >
                    <span>Tham gia ngay</span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                </button>
            </div>
        </motion.div>
    );
};

export default EventCard;
