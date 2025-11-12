import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Heart, Star } from 'lucide-react'
import BookingForm from '../components/BookingForm'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const getEventImage = (title) => {
    const imageCategories = {
      'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&q=80',
      'node': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920&q=80',
      'mongodb': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1920&q=80',
      'workshop': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
      'conference': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80',
      'training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80',
      'music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80',
      'concert': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80',
      'dj': 'https://images.unsplash.com/photo-1571266028243-d220c6e87917?w=1920&q=80',
      'party': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80',
      'nightout': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
      'celebration': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80',
      'festival': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&q=80',
      'business': 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=1920&q=80',
      'tech': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80',
      'default': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80'
    }
    
    const lowercaseTitle = title?.toLowerCase() || ''
    for (const [key, url] of Object.entries(imageCategories)) {
      if (lowercaseTitle.includes(key)) {
        return url
      }
    }
    return imageCategories.default
  }

  const fetchEvent = () => {
    axios.get(`/api/events/${id}`)
      .then(res => {
        setEvent(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        toast.error('Failed to load event details')
      })
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  const handleBookingSuccess = () => {
    fetchEvent()
    setShowBookingForm(false)
    setTimeout(() => navigate('/bookings'), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Event Not Found</h2>
          <p className="text-text-secondary mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const bookedPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
  const isSoldOut = event.availableSeats === 0

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={getEventImage(event.title)}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl px-4"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {event.description}
            </p>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </motion.button>

        {/* Share Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleShare}
          className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          <Share2 size={20} />
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-text mb-6">Event Details</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-text-secondary">Date</p>
                    <p className="font-semibold text-text">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-text-secondary">Time</p>
                    <p className="font-semibold text-text">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-text-secondary">Location</p>
                    <p className="font-semibold text-text">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-text-secondary">Available Seats</p>
                    <p className="font-semibold text-text">{event.availableSeats} / {event.totalSeats}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text">Seats Booked</span>
                  <span className="text-sm text-text-secondary">{Math.round(bookedPercentage)}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bookedPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-3 rounded-full ${bookedPercentage > 80 ? 'bg-error' : bookedPercentage > 60 ? 'bg-warning' : 'bg-success'}`}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {event.totalSeats - event.availableSeats} booked, {event.availableSeats} remaining
                </p>
              </div>

              {/* Price Display */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Ticket Price</p>
                    <p className="text-3xl font-bold text-primary">${event.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">Per Person</p>
                    <p className="text-sm text-text-secondary">All taxes included</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* You Might Also Like Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-text mb-4">You Might Also Like</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Placeholder for similar events - in a real app, you'd fetch similar events */}
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="text-accent" size={16} />
                    <span className="text-sm font-medium text-text">Similar Event</span>
                  </div>
                  <p className="text-sm text-text-secondary">More events coming soon...</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="text-accent" size={16} />
                    <span className="text-sm font-medium text-text">Recommended</span>
                  </div>
                  <p className="text-sm text-text-secondary">Personalized recommendations...</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              {user ? (
                isSoldOut ? (
                  <div className="card text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <h3 className="text-xl font-bold text-text mb-2">Sold Out!</h3>
                    <p className="text-text-secondary">This event is completely booked.</p>
                  </div>
                ) : (
                  <BookingForm event={event} onSuccess={handleBookingSuccess} />
                )
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center glassmorphism"
                >
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold text-text mb-2">Login Required</h3>
                  <p className="text-text-secondary mb-6">
                    Please sign in to book tickets for this amazing event.
                  </p>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/login')}
                      className="w-full btn-primary"
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/register')}
                      className="w-full btn-outline"
                    >
                      Create Account
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Book Button (Mobile) */}
      {user && !isSoldOut && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowBookingForm(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg lg:hidden z-50"
        >
          <Calendar size={24} />
        </motion.button>
      )}

      {/* Mobile Booking Modal */}
      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end lg:hidden z-50"
          onClick={() => setShowBookingForm(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-white rounded-t-3xl p-6 w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-text">Book Tickets</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-text-secondary hover:text-text"
              >
                ✕
              </button>
            </div>
            <BookingForm event={event} onSuccess={handleBookingSuccess} />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
