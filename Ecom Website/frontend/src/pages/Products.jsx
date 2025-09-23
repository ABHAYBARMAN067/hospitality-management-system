import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/api';
import {
  ShoppingBagIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sort: sortBy,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
    setCurrentPage(1);
    fetchProducts();
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-mobile overflow-hidden hover:shadow-mobile-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images && product.images[0] ? product.images[0].url : '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isActive && product.stock <= 5 && (
            <span className="bg-red-500 text-white text-responsive-xs px-3 py-1 rounded-full font-semibold shadow-mobile">
              Low Stock
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-blue-600 text-white text-responsive-xs px-3 py-1 rounded-full font-bold shadow-mobile">
              SALE
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => handleAddToCart(product)}
            className="p-2 bg-white rounded-full shadow-mobile hover:shadow-mobile-lg hover:bg-blue-50 transition-all duration-200 focus-enhanced"
            title="Add to cart"
          >
            <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
          </button>
          <button
            className="p-2 bg-white rounded-full shadow-mobile hover:shadow-mobile-lg hover:bg-red-50 transition-all duration-200 focus-enhanced"
            title="Add to wishlist"
          >
            <HeartIcon className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
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

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full btn-primary text-responsive-sm font-bold py-3 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-responsive-base text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive py-responsive-lg">
        {/* Header Section */}
        <div className="text-center mb-responsive-lg">
          <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect items for your needs from our curated collection
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-mobile p-responsive-md mb-responsive-lg border border-gray-100">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-responsive-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full form-input text-responsive-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full form-input text-responsive-sm"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="createdAt">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary text-responsive-sm whitespace-nowrap"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline text-responsive-sm whitespace-nowrap"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide' : 'More'} Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-mobile p-responsive-md mb-responsive-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="form-label">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-input text-responsive-sm w-20"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-input text-responsive-sm w-20"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-responsive-base text-gray-600">
            Showing {products.length} of {totalPages * 12} products
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-responsive-sm text-gray-500">Sort by:</span>
            <span className="text-responsive-sm font-medium text-gray-900 capitalize">
              {sortBy.replace('-', ' ').replace('createdAt', 'Newest')}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-responsive-lg">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-mobile p-12 max-w-md mx-auto">
              <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-responsive-xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-responsive-base text-gray-600 mb-6">
                Try adjusting your search criteria or browse our categories
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary text-responsive-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary text-responsive-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl text-responsive-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-mobile'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary text-responsive-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
