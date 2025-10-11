import React from 'react';

const SkeletonLoader = ({ height = 20, width = '100%', style = {}, rounded = true }) => (
    <div
        className={`skeleton-loader ${rounded ? 'skeleton-rounded' : ''}`}
        aria-hidden="true"
        style={{ height, width, ...style }}
    />
);

export default SkeletonLoader;
