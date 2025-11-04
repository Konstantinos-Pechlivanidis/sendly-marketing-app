/* eslint-disable react/prop-types */
/**
 * Alert Component - Status messages and alerts
 */

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = ''
}) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'success',
      iconColor: 'text-green-500',
      textColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'error',
      iconColor: 'text-red-500',
      textColor: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'warning',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'info',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800'
    }
  };

  const style = types[type] || types.info;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${style.textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${style.textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${style.iconColor} hover:opacity-75 transition-opacity`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;

