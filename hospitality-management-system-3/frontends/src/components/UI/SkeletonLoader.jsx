import React from 'react';

const SkeletonLoader = ({ height = 20, width = '100%', style = {} }) => (
    <div
        className="skeleton-loader"
        style={{ height, width, ...style }}
    />
);

export default SkeletonLoader;
