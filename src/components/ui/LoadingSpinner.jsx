import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = 'Loading...',
  showText = true 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizes[size]} animate-spin`}>
        <div className="h-full w-full border-4 border-gray-600 border-t-white rounded-full"></div>
      </div>
      {showText && (
        <p className="mt-2 text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
