import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const ErrorMessage = ({ 
  message, 
  className = '', 
  showIcon = true,
  onRetry = null 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {showIcon && (
        <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mb-2" />
      )}
      <p className="text-red-500 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
