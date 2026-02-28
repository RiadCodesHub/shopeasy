import { div } from 'framer-motion/client';
import react from 'react';
import { UseFormRegister, FieldError} from 'react-hook-form';

 interface FromInputProps extends react.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    register: UseFormRegister<any>;
    error?: FieldError | { message?: string };
    required? : boolean;
}

const FormInput: React.FC<FromInputProps> = ({
    label,
    name,
    register,
    error,
    required = false,
    className = '',
    ...props
}) => {
 const errorMessage = error && typeof error === 'object' && 'message' in error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : undefined;

    return (
        <div className='mb-4'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span> }
            </label>
            <input 
            {...register(name)}
            {...props}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${error ? 
                    'border-red-500 focus:border-red-500 focus-ring-red-500' 
                    :'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                } ${className}
                `} aria-invalid = {error ? 'true' : 'false'} />
                {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}

        </div>
    )
}

export default FormInput;