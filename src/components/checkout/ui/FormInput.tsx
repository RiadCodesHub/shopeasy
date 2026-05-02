import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError | { message?: string };
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? error.message
      : typeof error === 'string'
      ? error
      : undefined;

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium mb-2 text-text-secondary">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {/* Input */}
      <input
        {...register(name)}
        {...props}
        className={`input ${error ? 'badge-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-1 text-sm text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;