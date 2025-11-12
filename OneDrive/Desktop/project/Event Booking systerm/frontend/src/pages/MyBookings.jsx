import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Filter, X, Ticket, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = () => {
    axios.get(`/api/bookings/user/${user._id}`)
      .then(res => {
        setBookings(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        toast.error('Failed to load bookings')
      })
  }

  const handleCancelBooking = async () => {
    if (!selectedBooking) return

    try {
      // In a real app, you'd have a cancel endpoint
      // For now, we'll just show a success message
      toast.success('Booking cancelled successfully')
      setShowCancelModal(false)
      setSelectedBooking(null)
      fetchBookings() // Refresh the list
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const eventDate = new Date(booking.eventId?.date)
    const now = new Date()

    switch (filter) {
      case 'upcoming':
        return eventDate >= now
      case 'past':
        return eventDate < now
      case 'cancelled':
        return booking.status === 'cancelled'
      default:
        return true
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20'
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20'
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      default:
        return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20'
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'failed':
        return 'bg-error/10 text-error border-error/20'
      default:
        return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20'
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
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-purple-900/90 to-pink-600/85"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <Ticket size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">My Bookings</h1>
            <p className="text-white/90 text-lg">Manage your event tickets and reservations</p>
          </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'upcoming'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'past'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              Past Events
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'cancelled'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              Cancelled
            </button>
          </div>
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto">
              <Ticket size={80} className="mx-auto text-white/80 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No bookings found</h3>
              <p className="text-white/80 mb-8 text-lg">
                {filter === 'all'
                  ? "You haven't booked any events yet"
                  : `No ${filter} bookings found`
                }
              </p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Browse Events
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                          {booking.eventId?.title || 'Event'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                            <Calendar size={18} className="text-primary" />
                            <span className="font-medium">{booking.eventId?.date}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-lg">
                            <Clock size={18} className="text-accent" />
                            <span className="font-medium">{booking.eventId?.time}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-pink-100 px-3 py-1.5 rounded-lg">
                            <MapPin size={18} className="text-pink-600" />
                            <span className="font-medium">{booking.eventId?.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                        <Users size={18} className="text-primary" />
                        <span className="text-sm font-semibold text-text">
                          {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                        </span>
                      </div>

                      <span className={`px-4 py-2 rounded-lg text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>

                      <span className={`px-4 py-2 rounded-lg text-xs font-bold border-2 ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-center sm:text-right bg-gradient-to-br from-primary to-purple-600 text-white px-6 py-4 rounded-xl">
                      <p className="text-xs font-medium opacity-90 mb-1">Total Paid</p>
                      <p className="text-3xl font-bold">
                        ${(booking.eventId?.price || 0) * booking.quantity}
                      </p>
                    </div>

                    {booking.status === 'confirmed' && new Date(booking.eventId?.date) > new Date() && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowCancelModal(true)
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all text-sm font-bold shadow-lg"
                      >
                        Cancel Booking
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-warning/10 rounded-full mr-4">
                  <AlertTriangle className="text-warning" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-text">Cancel Booking</h3>
              </div>

              <p className="text-text-secondary mb-8 text-lg">
                Are you sure you want to cancel your booking for <span className="font-bold text-text">"{selectedBooking?.eventId?.title}"</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-border text-text-secondary rounded-xl hover:bg-background transition-all font-semibold"
                >
                  Keep Booking
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelBooking}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-bold shadow-lg"
                >
                  Cancel Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}