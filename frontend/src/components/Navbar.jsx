import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              EventBooking
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-text-secondary hover:text-primary transition-colors flex items-center space-x-1">
                <Calendar size={18} />
                <span>Events</span>
              </Link>
              {user && (
                <>
                  <Link to="/bookings" className="text-text-secondary hover:text-primary transition-colors flex items-center space-x-1">
                    <User size={18} />
                    <span>My Bookings</span>
                  </Link>
                  <Link to="/my-events" className="text-text-secondary hover:text-primary transition-colors">
                    My Events
                  </Link>
                  <Link to="/host-event" className="text-accent hover:text-accent/80 transition-colors font-semibold flex items-center space-x-1">
                    <Plus size={18} />
                    <span>Host Event</span>
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-text-secondary hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
              <>
                <span className="text-text-secondary hidden sm:block">Hello, {user.name}</span>
                <motion.button
                  onClick={logout}
                  className="bg-error hover:bg-error/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
