import React from 'react';
import FormInput from '@/components/checkout/ui/FormInput';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone } from 'lucide-react';

const PersonalInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();
  const personalInfoErrors = errors.personalInfo as any;
  
  return (
    <div className="card p-6 mb-6">
      <h3 className="text-xl font-bold text-(--foreground) mb-6 flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <User className="h-5 w-5 text-primary" />
        </div>
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormInput
          label="First Name"
          name="personalInfo.firstName"
          register={register}
          error={personalInfoErrors?.firstName}
          required
          placeholder="Enter your first name"
        />

        <FormInput
          label="Last Name"
          name="personalInfo.lastName"
          register={register}
          error={personalInfoErrors?.lastName}
          required
          placeholder="Enter your last name"
        />

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
          placeholder="+1 234 567 8900"
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;