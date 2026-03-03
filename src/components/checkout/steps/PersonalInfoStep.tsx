import react from 'react';
import  FormInput from '@/src/components/checkout/ui/FormInput';
import { useFormContext } from 'react-hook-form';

const PersonalInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();
const personalInfoErrors = errors.personalInfo as any;
    return(
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    👩🏿
                </span>
                Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                 label='First Name'
                 name='personalInfo.firstName'
                 register={register}
                 error = {personalInfoErrors?.firstName}
                 required
                 placeholder='Enter your First name' />

                <FormInput
                 label="Last Name"
                 name="personalInfo.lastName"
                 register={register}
                 error={personalInfoErrors?.lastName}
                 required
                 placeholder="Enter your last name" />

                 <FormInput
                 label="Email Address"
                 name="personalInfo.email"
                 type="email"
                 register={register}
                 error={personalInfoErrors?.email}
                 required
                 placeholder="john@example.com"
               />
                 <FormInput
                 label="Phone Number"
                 name="personalInfo.phone"
                 type="tel"
                 register={register}
                 error={personalInfoErrors?.phone}
                 required
                 placeholder="1234567890"
               />
            </div>
        </div>
    )
}

export default PersonalInfoStep;