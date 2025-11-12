const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    if (!eventId || !quantity) return res.status(400).json({ message: 'Missing fields' });

    // Atomically decrement seats if available
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: quantity } },
      { $inc: { availableSeats: -quantity } },
      { new: true }
    );

    if (!updatedEvent) return res.status(400).json({ message: 'Not enough seats available' });

    const booking = await Booking.create({ userId: req.user._id, eventId, quantity, paymentStatus: 'pending' });
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    // ensure users can only fetch their own or admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const bookings = await Booking.find({ userId }).populate('eventId');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('eventId userId');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
