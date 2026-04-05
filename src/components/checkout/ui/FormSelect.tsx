import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  error?: FieldError;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  register,
  options,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium mb-2 text-(--foreground-secondary)">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {/* Select */}
      <select
        {...register(name)}
        {...props}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-error">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormSelect;