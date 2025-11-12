import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react'
import AdminEventForm from '../components/AdminEventForm'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const fetchData = () => {
    Promise.all([
      axios.get('/api/events'),
      axios.get('/api/bookings')
    ]).then(([eventsRes, bookingsRes]) => {
      setEvents(eventsRes.data)
      setBookings(bookingsRes.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
      toast.error('Failed to load dashboard data')
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    try {
      await axios.delete(`/api/events/${id}`)
      toast.success('Event deleted successfully')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEvent(null)
    fetchData()
  }

  // Calculate stats
  const totalEvents = events.length
  const totalBookings = bookings.length
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.eventId?.price || 0) * b.quantity, 0)
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-border"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </motion.div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-secondary hover:text-text"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-heading font-bold text-text">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h1>
          </div>

          {activeTab === 'events' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowForm(!showForm); setEditingEvent(null); }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>{showForm ? 'Cancel' : 'Create Event'}</span>
            </motion.button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="card text-center"
                >
                  <Calendar className="mx-auto text-primary mb-2" size={32} />
                  <div className="text-2xl font-bold text-text">{totalEvents}</div>
                  <div className="text-text-secondary">Total Events</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="card text-center"
                >
                  <Users className="mx-auto text-success mb-2" size={32} />
                  <div className="text-2xl font-bold text-text">{confirmedBookings}</div>
                  <div className="text-text-secondary">Confirmed Bookings</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="card text-center"
                >
                  <DollarSign className="mx-auto text-accent mb-2" size={32} />
                  <div className="text-2xl font-bold text-text">${totalRevenue}</div>
                  <div className="text-text-secondary">Total Revenue</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="card text-center"
                >
                  <TrendingUp className="mx-auto text-warning mb-2" size={32} />
                  <div className="text-2xl font-bold text-text">
                    {totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%
                  </div>
                  <div className="text-text-secondary">Booking Rate</div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-bold text-text mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {events.slice(0, 5).map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-text">{event.title}</div>
                          <div className="text-sm text-text-secondary">{event.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-primary">${event.price}</div>
                          <div className="text-sm text-text-secondary">
                            {event.availableSeats}/{event.totalSeats} seats
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold text-text mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-text">{booking.userId?.name || 'User'}</div>
                          <div className="text-sm text-text-secondary">{booking.eventId?.title}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed'
                              ? 'bg-success/10 text-success'
                              : 'bg-error/10 text-error'
                          }`}>
                            {booking.status}
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {booking.quantity}x
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {showForm && (
                <AdminEventForm
                  event={editingEvent}
                  onSuccess={handleFormSuccess}
                  onCancel={() => { setShowForm(false); setEditingEvent(null); }}
                />
              )}

              <div className="card">
                <h3 className="text-xl font-bold text-text mb-4">
                  Manage Events ({events.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-text">Event</th>
                        <th className="text-left py-3 px-4 font-semibold text-text">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-text">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-text">Seats</th>
                        <th className="text-left py-3 px-4 font-semibold text-text">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-text">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event, index) => (
                        <motion.tr
                          key={event._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-background/50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-text">{event.title}</div>
                            <div className="text-sm text-text-secondary line-clamp-1">{event.description}</div>
                          </td>
                          <td className="py-3 px-4 text-text-secondary">{event.date}</td>
                          <td className="py-3 px-4 text-text-secondary">{event.location}</td>
                          <td className="py-3 px-4 text-text-secondary">
                            {event.availableSeats}/{event.totalSeats}
                          </td>
                          <td className="py-3 px-4 font-medium text-primary">${event.price}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setEditingEvent(event); setShowForm(true); }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(event._id)}
                                className="p-2 text-error hover:bg-error/10 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-text mb-4">
                All Bookings ({bookings.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-text">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-text">Event</th>
                      <th className="text-left py-3 px-4 font-semibold text-text">Tickets</th>
                      <th className="text-left py-3 px-4 font-semibold text-text">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-text">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border hover:bg-background/50"
                      >
                        <td className="py-3 px-4 font-medium text-text">
                          {booking.userId?.name || 'User'}
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {booking.eventId?.title || 'Event'}
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {booking.quantity}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary">
                          ${(booking.eventId?.price || 0) * booking.quantity}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-success/10 text-success border border-success/20'
                              : booking.status === 'cancelled'
                              ? 'bg-error/10 text-error border border-error/20'
                              : 'bg-warning/10 text-warning border border-warning/20'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-success/10 text-success border border-success/20'
                              : booking.paymentStatus === 'pending'
                              ? 'bg-warning/10 text-warning border border-warning/20'
                              : 'bg-error/10 text-error border border-error/20'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center py-16"
            >
              <BarChart3 size={64} className="mx-auto text-text-secondary/50 mb-4" />
              <h3 className="text-xl font-bold text-text mb-2">Analytics Coming Soon</h3>
              <p className="text-text-secondary">
                Advanced analytics and reporting features will be available here.
              </p>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center py-16"
            >
              <Settings size={64} className="mx-auto text-text-secondary/50 mb-4" />
              <h3 className="text-xl font-bold text-text mb-2">Settings Coming Soon</h3>
              <p className="text-text-secondary">
                System configuration and settings will be available here.
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
