import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/api';
import {
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  HeartIcon,
  UserIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=8');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-mobile overflow-hidden hover:shadow-mobile-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        {product.isActive && product.stock <= 5 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-responsive-xs px-3 py-1 rounded-full font-semibold shadow-mobile">
            Low Stock
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-responsive-xs px-3 py-1 rounded-full font-bold shadow-mobile">
            SALE
          </span>
        )}

        {/* Quick Add to Cart */}
        <button
          onClick={() => handleAddToCart(product)}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-mobile hover:shadow-mobile-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          title="Add to cart"
        >
          <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
        </button>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-12 p-2 bg-white rounded-full shadow-mobile hover:shadow-mobile-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
          <HeartIcon className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="p-responsive-md">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-responsive-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-responsive-xs text-gray-600 ml-2">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-responsive-lg font-bold text-blue-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-responsive-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <span className={`text-responsive-xs px-3 py-1 rounded-full font-semibold ${
            product.isActive && product.stock > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive && product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-responsive-base text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container-responsive py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-responsive-4xl md:text-responsive-5xl font-bold mb-6 leading-tight">
              Welcome to E-Shop
            </h1>
            <p className="text-responsive-lg md:text-responsive-xl mb-8 text-blue-100 leading-relaxed">
              Discover amazing products at unbeatable prices
            </p>
            <Link
              to="/products"
              className="inline-flex items-center btn-primary text-responsive-base font-semibold px-8 py-4 rounded-2xl shadow-mobile-lg hover:shadow-mobile-lg transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Shop Now
              <ShoppingBagIcon className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <TruckIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-responsive-xl font-bold mb-4 text-gray-900">Free Shipping</h3>
              <p className="text-responsive-base text-gray-600 leading-relaxed">Free shipping on orders over $50 with fast delivery</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <ShieldCheckIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-responsive-xl font-bold mb-4 text-gray-900">Secure Payment</h3>
              <p className="text-responsive-base text-gray-600 leading-relaxed">100% secure payment processing with SSL encryption</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                <CurrencyDollarIcon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-responsive-xl font-bold mb-4 text-gray-900">Best Prices</h3>
              <p className="text-responsive-base text-gray-600 leading-relaxed">Competitive prices guaranteed with price match</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-responsive-base text-gray-600">Find exactly what you're looking for</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className="group bg-white p-6 rounded-2xl shadow-mobile hover:shadow-mobile-lg transition-all duration-300 text-center transform hover:-translate-y-1"
                >
                  <h3 className="text-responsive-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category}
                  </h3>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-0.5 bg-blue-600 mx-auto"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-responsive-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-responsive-base text-gray-600">Handpicked items just for you</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              View All
              <ShoppingBagIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative container-responsive text-center">
          <h2 className="text-responsive-3xl font-bold mb-6 leading-tight">
            Ready to Start Shopping?
          </h2>
          <p className="text-responsive-lg mb-8 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your next favorite product
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center btn-primary text-responsive-base font-semibold px-8 py-4 rounded-2xl shadow-mobile-lg hover:shadow-mobile-lg transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Create Account
              <UserIcon className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-lg"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      </section>
    </div>
  );
};

export default Home;
