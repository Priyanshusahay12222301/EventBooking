import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, DollarSign, Users, FileText, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function HostEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    totalSeats: 0
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/events', { ...formData, availableSeats: formData.totalSeats })
      toast.success('🎉 Event created successfully!')
      navigate('/my-events')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/90 via-primary/90 to-purple-900/95"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <Sparkles size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
              Host Your Event
            </h1>
            <p className="text-white/90 text-lg">
              Create and manage your own events. Share with attendees and track bookings.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                  <FileText size={18} className="text-primary" />
                  Event Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., React Workshop 2025"
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                  <FileText size={18} className="text-primary" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your event, what attendees will learn or experience..."
                  className="input-field resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                    <Calendar size={18} className="text-primary" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                    <Clock size={18} className="text-primary" />
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                  <MapPin size={18} className="text-primary" />
                  Location *
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Community Center, 123 Main St or 'Online'"
                  className="input-field"
                />
              </div>

              {/* Price and Total Seats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                    <DollarSign size={18} className="text-success" />
                    Ticket Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0 for free events"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-text mb-2">
                    <Users size={18} className="text-primary" />
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder="e.g., 50"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${
                    loading
                      ? 'bg-text-secondary/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating Event...
                    </span>
                  ) : (
                    'Create Event'
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => navigate('/my-events')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-text-secondary/10 text-text-secondary hover:bg-text-secondary/20 rounded-xl font-bold text-lg transition-all"
                >
                  <ArrowLeft size={20} />
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}