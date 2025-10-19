/**
 * Textarea Component - Multi-line text input
 */

export function Textarea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  maxLength,
  error,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {maxLength && value && (
            <span className="text-xs text-gray-500">
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Textarea;

