import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Ticket, DollarSign, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookingForm({ event, onSuccess }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/bookings', { eventId: event._id, quantity })
      toast.success('🎉 Booking successful! Check your email for confirmation.')
      if (onSuccess) onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = event.price * quantity

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card mt-6"
    >
      <div className="flex items-center mb-4">
        <Ticket className="text-primary mr-2" size={24} />
        <h3 className="text-xl font-bold text-text">Book Your Tickets</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Number of Tickets
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="number"
              min="1"
              max={event.availableSeats}
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <motion.div
          className="bg-primary/10 rounded-lg p-4 border border-primary/20"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          key={totalPrice}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center text-text-secondary">
              <DollarSign size={18} className="mr-1" />
              <span>Total Price:</span>
            </div>
            <motion.span
              className="text-2xl font-bold text-primary"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              key={totalPrice}
            >
              ${totalPrice}
            </motion.span>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading || quantity > event.availableSeats}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Ticket size={18} />
              <span>Confirm Booking</span>
            </>
          )}
        </motion.button>

        {quantity > event.availableSeats && (
          <p className="text-error text-sm text-center">
            Only {event.availableSeats} seats available
          </p>
        )}
      </form>
    </motion.div>
  )
}
