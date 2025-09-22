import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const shippingCost = total >= 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

  const CartItem = ({ item }) => (
    <div className="group bg-white rounded-2xl shadow-mobile p-responsive-md border border-gray-100 hover:shadow-mobile-lg transition-all duration-300">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link to={`/product/${item.product._id}`}>
            <img
              src={item.product.images[0] || '/placeholder-product.jpg'}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-xl hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${item.product._id}`}
            className="text-responsive-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {item.product.name}
          </Link>
          <p className="text-responsive-sm text-gray-600 mt-1">
            ${item.product.price} each
          </p>
          {item.product.stock <= 5 && (
            <p className="text-responsive-xs text-red-600 mt-1">
              Only {item.product.stock} left in stock
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
              className="p-2 rounded-lg hover:bg-white hover:shadow-mobile transition-all duration-200 focus-enhanced"
            >
              <MinusIcon className="h-4 w-4 text-gray-600" />
            </button>
            <span className="px-4 py-2 text-responsive-base font-semibold min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
              className="p-2 rounded-lg hover:bg-white hover:shadow-mobile transition-all duration-200 focus-enhanced"
            >
              <PlusIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Price and Remove */}
        <div className="text-right min-w-[100px]">
          <p className="text-responsive-lg font-bold text-gray-900">
            ${(item.product.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={() => handleRemoveItem(item.product._id)}
            className="text-red-600 hover:text-red-700 text-responsive-sm mt-2 flex items-center justify-end w-full group/remove"
          >
            <TrashIcon className="h-4 w-4 mr-1 group-hover/remove:scale-110 transition-transform" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-responsive-md">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-mobile p-12 mb-8">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-responsive-base text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="btn-primary text-responsive-base font-semibold py-4 px-8 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 rotate-180 inline" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container-responsive py-responsive-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-responsive-lg">
          <div>
            <h1 className="text-responsive-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-responsive-base text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            to="/products"
            className="btn-outline text-responsive-sm mt-4 sm:mt-0"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-responsive-lg">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-mobile p-responsive-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-responsive-xl font-bold text-gray-900">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="btn-secondary text-responsive-sm text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-mobile p-responsive-lg border border-gray-100 sticky top-8">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Order Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-responsive-base text-gray-600">Subtotal</span>
                  <span className="text-responsive-base font-semibold">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-responsive-base text-gray-600">Shipping</span>
                  </div>
                  <span className="text-responsive-base font-semibold text-green-600">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-responsive-base text-gray-600">Tax</span>
                  </div>
                  <span className="text-responsive-base font-semibold">${tax.toFixed(2)}</span>
                </div>

                {/* Free Shipping Progress */}
                {total < 50 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-responsive-sm text-gray-600">Free shipping</span>
                      <span className="text-responsive-sm font-medium">
                        ${(50 - total).toFixed(2)} to go
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-responsive-lg font-bold text-gray-900">Total</span>
                    <span className="text-responsive-xl font-bold text-blue-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full btn-primary text-responsive-base font-semibold py-4 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200 block text-center"
              >
                Proceed to Checkout
              </Link>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-responsive-sm text-gray-500">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
