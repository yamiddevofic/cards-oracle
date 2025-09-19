import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  className = '',
  labelClassName = '',
  selectClassName = '',
  error = null,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent ${selectClassName}`}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
