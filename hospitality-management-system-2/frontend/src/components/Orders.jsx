import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: 1,
          restaurantName: 'Spice Garden',
          items: [
            { name: 'Chicken Biryani', quantity: 2, price: 240 },
            { name: 'Garlic Naan', quantity: 4, price: 80 }
          ],
          total: 560,
          status: 'delivered',
          orderDate: '2024-01-15T18:30:00Z',
          deliveryAddress: '123 Main St, Downtown'
        },
        {
          id: 2,
          restaurantName: 'The Italian Corner',
          items: [
            { name: 'Margherita Pizza', quantity: 1, price: 320 },
            { name: 'Caesar Salad', quantity: 1, price: 180 }
          ],
          total: 500,
          status: 'preparing',
          orderDate: '2024-01-20T19:45:00Z',
          deliveryAddress: '456 Oak Ave, Midtown'
        },
        {
          id: 3,
          restaurantName: 'Burger Palace',
          items: [
            { name: 'Double Cheese Burger', quantity: 1, price: 280 },
            { name: 'French Fries', quantity: 2, price: 120 }
          ],
          total: 400,
          status: 'pending',
          orderDate: '2024-01-22T20:15:00Z',
          deliveryAddress: '789 Pine St, Uptown'
        }
      ];

      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'preparing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FaCheck className="w-4 h-4" />;
      case 'preparing': return <FaClock className="w-4 h-4" />;
      case 'pending': return <FaShoppingBag className="w-4 h-4" />;
      case 'cancelled': return <FaTimes className="w-4 h-4" />;
      default: return <FaShoppingBag className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Orders
        </h1>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {['all', 'pending', 'preparing', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {activeTab === 'all'
                ? "You haven't placed any orders yet."
                : `No ${activeTab} orders found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {order.restaurantName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ordered on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Delivery to: {order.deliveryAddress}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total: ₹{order.total}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Orders;
