import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Calendar, MapPin, Users, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import EventCard from '../components/EventCard'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    axios.get('/api/events')
      .then(res => {
        setEvents(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section')
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const featuredEvents = events.slice(0, 6)
  const categories = [
    { name: 'Technology', icon: '💻', count: 12, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80' },
    { name: 'Business', icon: '💼', count: 8, image: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=400&q=80' },
    { name: 'Arts & Culture', icon: '🎨', count: 15, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80' },
    { name: 'Sports', icon: '⚽', count: 6, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
    { name: 'Music', icon: '🎵', count: 10, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80' },
    { name: 'Food & Drink', icon: '🍽️', count: 7, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Organizer',
      content: 'EventBooking made it incredibly easy to manage and promote my events. The platform is intuitive and user-friendly.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'
    },
    {
      name: 'Mike Chen',
      role: 'Regular Attendee',
      content: 'I love how seamless the booking process is. Found amazing events and great deals on tickets!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
    },
    {
      name: 'Emily Davis',
      role: 'Corporate Client',
      content: 'Perfect for organizing team events. The analytics and management tools are top-notch.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80'
    }
  ]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80" 
            alt="Live Concert Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-primary/80 to-pink-600/85"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-heading font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Find & Book Your Next
              <br />
              <span className="text-accent">Amazing Event</span>
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover thousands of incredible events happening near you. From concerts to conferences,
              find your perfect experience and book tickets instantly.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button onClick={scrollToEvents} className="btn-secondary text-lg px-8 py-4">
                  Browse Events
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-4">
                  Sign Up Free
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-white/20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-white/20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          <Calendar size={32} />
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search events by title, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 text-lg py-4"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-4">Explore Categories</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Find events that match your interests across various categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-xl cursor-pointer group h-32"
              >
                <img 
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-xs text-white/80">{category.count} events</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events-section" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-4">Featured Events</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Don't miss out on these handpicked events that are creating buzz
            </p>
          </motion.div>

          {featuredEvents.length > 0 && (
            <Slider {...sliderSettings} className="featured-events-slider">
              {featuredEvents.map((event, index) => (
                <div key={event._id} className="px-2">
                  <EventCard event={event} index={index} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80" 
          alt="Why Choose Us Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent/95"></div>
        <div className="relative max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Why Choose EventBooking?</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              We're committed to making event discovery and booking effortless for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={48} className="text-accent mb-4" />,
                title: 'Easy Booking',
                description: 'Book tickets in seconds with our streamlined checkout process'
              },
              {
                icon: <Users size={48} className="text-accent mb-4" />,
                title: 'Verified Events',
                description: 'All events are verified and reviewed for quality and authenticity'
              },
              {
                icon: <Star size={48} className="text-accent mb-4" />,
                title: 'Best Prices',
                description: 'Get the best deals and early bird discounts on all events'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-text mb-4">What Our Users Say</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Join thousands of satisfied users who trust EventBooking for their event needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="flex justify-center mb-4">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-accent fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-text">{testimonial.name}</h4>
                  <p className="text-sm text-text-secondary">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to Discover Your Next Event?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Join our community of event enthusiasts and never miss out on amazing experiences
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4 inline-flex items-center">
                Get Started Today
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventBooking</h3>
              <p className="text-white/80">
                Your gateway to unforgettable experiences. Discover, book, and enjoy events that matter to you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/events" className="hover:text-accent transition-colors">Browse Events</Link></li>
                <li><Link to="/host-event" className="hover:text-accent transition-colors">Host Event</Link></li>
                <li><Link to="/register" className="hover:text-accent transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-accent transition-colors">Facebook</a>
                <a href="#" className="text-white/80 hover:text-accent transition-colors">Twitter</a>
                <a href="#" className="text-white/80 hover:text-accent transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 EventBooking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
