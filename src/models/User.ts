import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  image?: string;
  phone?: string;
  addresses: IAddress[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  type: { 
    type: String, 
    enum: ['shipping', 'billing'], 
    required: true 
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Bangladesh' },
  isDefault: { type: Boolean, default: false },
  phone: { type: String }
});

const userSchema = new Schema<IUser> (
    {
        name: {
            type : String,
            required: [true, 'Name is required'],
            trim: true
        },
        email : {
            type: String,
            required : [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim : true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
            ]
        },

         password: { 
             type: String, 
             required: [true, 'Password is required'],
             minlength: [6, 'Password must be at least 6 characters'],
             select: false // Don't return password by default in queries
           },
        role: { 
             type: String, 
             enum: ['user', 'admin'], 
             default: 'user' 
           },
        image: { type: String },
        phone: { type: String },
        addresses: [AddressSchema],
        emailVerified: { type: Date }    
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await  bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
