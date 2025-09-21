import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
      setBookings(response.data.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      // Update the booking status in the local state
      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-unknown';
    }
  };

  const filterBookings = (status) => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDateTime = new Date(`${booking.bookingDate}T${booking.endTime}`);

      if (status === 'upcoming') {
        return bookingDateTime > now && booking.status !== 'cancelled';
      } else if (status === 'past') {
        return bookingDateTime <= now;
      } else if (status === 'cancelled') {
        return booking.status === 'cancelled';
      }
      return true;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  const upcomingBookings = filterBookings('upcoming');
  const pastBookings = filterBookings('past');
  const cancelledBookings = filterBookings('cancelled');

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your table reservations</p>
        </div>

        {/* Tabs */}
        <div className="bookings-tabs">
          <button
            className={activeTab === 'upcoming' ? 'active' : ''}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            className={activeTab === 'past' ? 'active' : ''}
            onClick={() => setActiveTab('past')}
          >
            Past ({pastBookings.length})
          </button>
          <button
            className={activeTab === 'cancelled' ? 'active' : ''}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {activeTab === 'upcoming' && (
            <BookingsList
              bookings={upcomingBookings}
              onCancel={cancelBooking}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              formatTime={formatTime}
              emptyMessage="No upcoming bookings"
            />
          )}

          {activeTab === 'past' && (
            <BookingsList
              bookings={pastBookings}
              onCancel={cancelBooking}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              formatTime={formatTime}
              emptyMessage="No past bookings"
            />
          )}

          {activeTab === 'cancelled' && (
            <BookingsList
              bookings={cancelledBookings}
              onCancel={cancelBooking}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              formatTime={formatTime}
              emptyMessage="No cancelled bookings"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/hotels" className="action-btn primary">
            Book New Table
          </Link>
        </div>
      </div>
    </div>
  );
};

// Bookings List Component
const BookingsList = ({
  bookings,
  onCancel,
  getStatusColor,
  formatDate,
  formatTime,
  emptyMessage
}) => {
  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyMessage}</h3>
        <p>Start by booking a table at your favorite restaurant!</p>
      </div>
    );
  }

  return (
    <div className="bookings-grid">
      {bookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <div className="booking-header">
            <h3>{booking.Hotel?.name || 'Hotel'}</h3>
            <span className={`booking-status ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="booking-details">
            <div className="detail-item">
              <span className="detail-label">📅 Date:</span>
              <span className="detail-value">{formatDate(booking.bookingDate)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">🕐 Time:</span>
              <span className="detail-value">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">👥 Guests:</span>
              <span className="detail-value">{booking.numberOfGuests}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">📍 Table:</span>
              <span className="detail-value">
                Table {booking.Table?.tableNumber} (Capacity: {booking.Table?.capacity})
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">💰 Total:</span>
              <span className="detail-value">₹{booking.totalAmount}</span>
            </div>

            {booking.specialRequests && (
              <div className="detail-item">
                <span className="detail-label">📝 Special Requests:</span>
                <span className="detail-value">{booking.specialRequests}</span>
              </div>
            )}
          </div>

          <div className="booking-actions">
            {booking.status === 'confirmed' && new Date(`${booking.bookingDate}T${booking.startTime}`) > new Date() && (
              <button
                onClick={() => onCancel(booking.id)}
                className="cancel-btn"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
