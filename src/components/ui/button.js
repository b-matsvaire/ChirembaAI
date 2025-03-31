import React from 'react';

export const Button = ({ onClick, children, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded ${className} ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};
