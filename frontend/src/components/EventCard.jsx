import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, DollarSign, Users } from 'lucide-react'

export default function EventCard({ event, index = 0 }) {
  // Generate a consistent image based on event title
  const getEventImage = (title) => {
    const imageCategories = {
      'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      'node': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
      'mongodb': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
      'workshop': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
      'training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      'music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'concert': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      'dj': 'https://images.unsplash.com/photo-1571266028243-d220c6e87917?w=800&q=80',
      'party': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'nightout': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      'celebration': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
      'business': 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&q=80',
      'tech': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'
    }
    
    const lowercaseTitle = title.toLowerCase()
    for (const [key, url] of Object.entries(imageCategories)) {
      if (lowercaseTitle.includes(key)) {
        return url
      }
    }
    return imageCategories.default
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card group cursor-pointer overflow-hidden p-0"
    >
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <img 
          src={getEventImage(event.title)}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary shadow-lg">
          ${event.price}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {event.description?.substring(0, 120)}{event.description?.length > 120 ? '...' : ''}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-text-secondary">
            <Calendar size={16} className="mr-2 text-primary" />
            <span>{event.date}</span>
            <Clock size={16} className="ml-4 mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-text-secondary">
            <MapPin size={16} className="mr-2 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-text-secondary">
            <Users size={16} className="mr-1" />
            <span>{event.availableSeats} seats left</span>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/events/${event._id}`}
              className="btn-primary text-sm px-4 py-2"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
