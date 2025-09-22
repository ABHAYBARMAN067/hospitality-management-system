import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  overlay = false,
  color = 'blue',
  variant = 'default'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600',
    green: 'border-green-200 border-t-green-600',
    purple: 'border-purple-200 border-t-purple-600',
    red: 'border-red-200 border-t-red-600',
    yellow: 'border-yellow-200 border-t-yellow-600',
    gray: 'border-gray-200 border-t-gray-600'
  };

  const variantClasses = {
    default: 'rounded-full',
    dots: 'rounded-none',
    pulse: 'rounded-lg',
    bars: 'rounded-none'
  };

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center">
      {variant === 'dots' ? (
        <div className="flex space-x-1">
          <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}></div>
          <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
          <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
        </div>
      ) : variant === 'pulse' ? (
        <div className={`${sizeClasses[size]} bg-current opacity-75 animate-pulse-enhanced`}></div>
      ) : variant === 'bars' ? (
        <div className="flex space-x-1">
          <div className="w-1 h-6 bg-current animate-pulse"></div>
          <div className="w-1 h-6 bg-current animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="w-1 h-6 bg-current animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-1 h-6 bg-current animate-pulse" style={{animationDelay: '0.3s'}}></div>
        </div>
      ) : (
        <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} ${variantClasses[variant]} animate-spin`}></div>
      )}
      {text && (
        <p className="text-responsive-sm text-gray-600 mt-4 text-center animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-mobile-lg p-8 max-w-sm mx-4">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  return <SpinnerContent />;
};

// Additional specialized loading components
export const LoadingDots = ({ size = 'md', color = 'blue', text }) => (
  <LoadingSpinner size={size} color={color} variant="dots" text={text} />
);

export const LoadingPulse = ({ size = 'md', color = 'blue', text }) => (
  <LoadingSpinner size={size} color={color} variant="pulse" text={text} />
);

export const LoadingBars = ({ size = 'md', color = 'blue', text }) => (
  <LoadingSpinner size={size} color={color} variant="bars" text={text} />
);

export const LoadingOverlay = ({ text = 'Loading...', children }) => (
  <div className="relative">
    {children}
    <LoadingSpinner overlay text={text} />
  </div>
);

export const SkeletonLoader = ({ className = '', lines = 3 }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      ></div>
    ))}
  </div>
);

export const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-mobile p-4">
    <SkeletonLoader className="mb-4" lines={1} />
    <div className="skeleton h-48 w-full mb-4"></div>
    <SkeletonLoader lines={2} />
  </div>
);

export default LoadingSpinner;
