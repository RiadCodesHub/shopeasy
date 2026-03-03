import react from 'react' ;
import { UseFormRegister, FieldError} from 'react-hook-form';

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps extends react.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name : string;
    register: UseFormRegister<any>;
    options: Option[];
    error ?: FieldError;
    required?: boolean;
}

const FormSelect : React.FC<FormSelectProps> = ({
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
        <label htmlFor="" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className='text-red-500'>*</span>}
        </label>
        <select 
        {...register(name)}
        {...props}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 
                'border-red-500 focus:border-roed-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                } ${className}
            `}
            aria-invalid = {error ? 'true' : 'false'}
        >
        <option value="">Select an poption</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
)}

export default FormSelect