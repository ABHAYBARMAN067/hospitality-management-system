 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BookingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    hotelId: '',
    tableId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    numberOfGuests: 1,
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    specialRequests: '',
    menuItems: []
  });

  const [hotels, setHotels] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (formData.hotelId) {
      fetchTablesAndMenu();
    }
  }, [formData.hotelId]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/hotels');

      // Fix: Correctly access the hotels data from API response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setHotels(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setHotels([]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to load hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTablesAndMenu = async () => {
    try {
      const [tablesResponse, menuResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/hotels/${formData.hotelId}/tables/available`),
        axios.get(`http://localhost:5000/api/hotels/${formData.hotelId}/menu`)
      ]);

      // Fix: Backend returns { success: true, data: tables/menuItems }
      // So we access response.data.data directly
      if (tablesResponse.data && tablesResponse.data.success && tablesResponse.data.data) {
        setTables(tablesResponse.data.data);
      } else {
        console.warn('Unexpected tables API response:', tablesResponse.data);
        setTables([]);
      }

      if (menuResponse.data && menuResponse.data.success && menuResponse.data.data) {
        setMenuItems(menuResponse.data.data);
      } else {
        console.warn('Unexpected menu API response:', menuResponse.data);
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching tables and menu:', error);
      setTables([]);
      setMenuItems([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMenuItemChange = (menuItemId, quantity) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: parseInt(quantity) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  };

  const addMenuItem = (menuItem) => {
    const existingItem = formData.menuItems.find(item => item.menuItemId === menuItem._id || menuItem.id);
    if (!existingItem) {
      setFormData(prev => ({
        ...prev,
        menuItems: [...prev.menuItems, {
          menuItemId: menuItem._id || menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1
        }]
      }));
    }
  };

  const calculateTotal = () => {
    const selectedTable = tables.find(t => (t._id || t.id) === formData.tableId);
    if (!selectedTable) return 0;

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    const tableRent = selectedTable.rentPerHour * hours;
    const menuTotal = formData.menuItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    return tableRent + menuTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        ...formData,
        totalAmount: calculateTotal()
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);

      navigate('/my-bookings', {
        state: { message: 'Booking created successfully!' }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="booking-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Booking</h1>
          <p>Fill in the details to book your table</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3>Hotel & Table Selection</h3>

            <div className="form-group">
              <label htmlFor="hotelId">Select Hotel *</label>
              <select
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel._id || hotel.id} value={hotel._id || hotel.id}>
                    {hotel.name} - {hotel.address?.city}, {hotel.address?.state}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="form-group">
              <label htmlFor="tableId">Select Table *</label>
              <select
                id="tableId"
                name="tableId"
                value={formData.tableId}
                onChange={handleChange}
                required
                disabled={!formData.hotelId}
              >
                <option value="">Choose a table</option>
                {tables.map(table => (
                  <option key={table._id || table.id} value={table._id || table.id}>
                    Table {table.tableNumber} (Capacity: {table.capacity}, ₹{table.rentPerHour}/hour)
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          <div className="form-section">
            <h3>Booking Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bookingDate">Date *</label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="startTime">Start Time *</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time *</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="numberOfGuests">Number of Guests *</label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                min="1"
                max={tables.find(t => (t._id || t.id) === formData.tableId)?.capacity || 20}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Customer Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Full Name *</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Phone Number *</label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email *</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Menu Items (Optional)</h3>

            {menuItems.length > 0 ? (
              <div className="menu-items-selection">
                {menuItems.map(item => (
                  <div key={item._id || item.id} className="menu-item-option">
                    <div className="menu-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <span className="price">₹{item.price}</span>
                    </div>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => addMenuItem(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No menu items available for this hotel.</p>
            )}

            {formData.menuItems.length > 0 && (
              <div className="selected-items">
                <h4>Selected Items:</h4>
                {formData.menuItems.map(item => (
                  <div key={item.menuItemId} className="selected-item">
                    <span>{item.name}</span>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleMenuItemChange(item.menuItemId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleMenuItemChange(item.menuItemId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Table Rent:</span>
              <span>₹{tables.find(t => (t._id || t.id) === formData.tableId)?.rentPerHour || 0}</span>
            </div>
            <div className="summary-item">
              <span>Menu Items:</span>
              <span>₹{formData.menuItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
            </div>
            <div className="summary-total">
              <strong>Total: ₹{calculateTotal()}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Creating Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
