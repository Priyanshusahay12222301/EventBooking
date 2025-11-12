import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2, Plus, Sparkles, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchMyEvents = () => {
    axios.get('/api/events')
      .then(res => {
        // Filter events created by the current user
        const userEvents = res.data.filter(e => e.createdBy === user?._id)
        setMyEvents(userEvents)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        toast.error('Failed to load events')
      })
  }

  useEffect(() => {
    if (user) {
      fetchMyEvents()
    }
  }, [user])

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await axios.delete(`/api/events/${id}`)
      toast.success('Event deleted successfully')
      fetchMyEvents()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-primary/90 to-pink-600/85"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6"
          >
            <div className="text-center md:text-left">
              <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <Sparkles size={48} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
                My Hosted Events
              </h1>
              <p className="text-white/90 text-lg">Manage events you've created</p>
            </div>
            <Link to="/host-event">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Plus size={24} />
                Host New Event
              </motion.button>
            </Link>
          </motion.div>

          {myEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-7xl mb-6">🎪</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No events yet
                </h3>
                <p className="text-white/80 mb-8 text-lg">
                  Start hosting events and manage them here
                </p>
                <Link to="/host-event">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Create Your First Event
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {myEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                        {event.description?.substring(0, 150)}{event.description?.length > 150 ? '...' : ''}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                          <Calendar size={18} className="text-primary" />
                          <span className="text-sm font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
                          <MapPin size={18} className="text-accent" />
                          <span className="text-sm font-medium truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-success/10 px-3 py-2 rounded-lg">
                          <DollarSign size={18} className="text-success" />
                          <span className="text-sm font-bold">${event.price}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-lg">
                          <Users size={18} className="text-purple-600" />
                          <span className="text-sm font-medium">{event.availableSeats}/{event.totalSeats}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                          event.availableSeats > 0 
                            ? 'bg-success/10 text-success' 
                            : 'bg-error/10 text-error'
                        }`}>
                          {event.availableSeats > 0 ? '✓ Available' : 'Sold Out'}
                        </div>
                        {event.availableSeats === 0 && (
                          <div className="px-4 py-2 bg-warning/10 text-warning rounded-lg font-semibold text-sm">
                            🔥 Fully Booked
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3">
                      <Link to={`/events/${event._id}`} className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <Eye size={18} />
                          View
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(event._id, event.title)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        <Trash2 size={18} />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
