import React from 'react';

export const Alert = ({ children, className }) => {
  return (
    <div className={`bg-red-100 text-red-700 p-4 rounded ${className}`}>
      {children}
    </div>
  );
};
