import React from 'react';

export const Badge = ({ children, onClick, className }) => {
  return (
    <span
      onClick={onClick}
      className={`px-3 py-1 text-sm bg-gray-200 rounded-full cursor-pointer ${className}`}
    >
      {children}
    </span>
  );
};
