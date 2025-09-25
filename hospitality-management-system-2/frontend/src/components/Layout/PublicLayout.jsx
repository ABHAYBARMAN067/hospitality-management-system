import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default PublicLayout;
