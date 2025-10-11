import React from 'react';

const LoadingSpinner = ({ size = 'medium', light = false }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-2 
                    ${light
                        ? 'border-white border-t-transparent'
                        : 'border-indigo-600 border-t-transparent'
                    }`}
            />
        </div>
    );
};

export default LoadingSpinner;
