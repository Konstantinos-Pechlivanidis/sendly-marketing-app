/**
 * Toggle Component - Switch/toggle button
 */

export function Toggle({ 
  checked, 
  onChange, 
  label,
  disabled = false,
  className = ''
}) {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
}

export default Toggle;

