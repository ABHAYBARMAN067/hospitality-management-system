import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/api';
import {
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      addItem(product, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-responsive-base text-gray-600">Loading amazing product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-responsive-md">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-mobile p-12 mb-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-responsive-base text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/products"
              className="btn-primary text-responsive-base"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container-responsive py-responsive-lg">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-responsive-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive-lg">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-mobile overflow-hidden border border-gray-100">
              <div className="aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-600 shadow-mobile'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-responsive-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-responsive-base text-gray-600">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-responsive-4xl font-bold text-blue-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-responsive-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-responsive-sm font-bold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-responsive-sm font-semibold ${
                product.isActive && product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.isActive && product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              {product.isActive && product.stock > 0 && (
                <span className="text-responsive-sm text-gray-600">
                  {product.stock} items available
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-responsive-xl font-bold mb-3">Description</h3>
              <p className="text-responsive-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-responsive-xl font-bold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-responsive-base text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            {product.isActive && product.stock > 0 && (
              <div>
                <h3 className="text-responsive-xl font-bold mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 rounded-lg hover:bg-white hover:shadow-mobile transition-all duration-200 focus-enhanced disabled:opacity-50"
                    >
                      <MinusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="px-6 py-3 text-responsive-lg font-bold min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-3 rounded-lg hover:bg-white hover:shadow-mobile transition-all duration-200 focus-enhanced disabled:opacity-50"
                    >
                      <PlusIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-responsive-sm text-gray-600">
                    {product.stock} available
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isActive || product.stock <= 0 || addingToCart}
                className="flex-1 btn-primary text-responsive-base font-bold py-4 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleWishlist}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200 focus-enhanced"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-mobile p-6 border border-gray-100">
              <h3 className="text-responsive-lg font-bold mb-4">Shipping & Returns</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-responsive-base text-gray-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  <span className="text-responsive-base text-gray-600">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-mobile p-responsive-lg border border-gray-100">
              <h2 className="text-responsive-3xl font-bold mb-8">Customer Reviews</h2>
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-responsive-lg">
                            {review.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-responsive-lg">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-responsive-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-responsive-base text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
