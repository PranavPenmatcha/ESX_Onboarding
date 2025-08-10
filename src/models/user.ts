import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  userName: string;
  dateOfBirth?: string;
  profilePic?: {
    key: string;
    url: string;
  } | null;
  isEmailVerified: boolean;
  firebaseUid: string;
  firebaseSignInProvider: string;
  isSuspended: boolean;
  walletAddress?: string;
  hashedKey?: string;
  hasCompletedOnboarding: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: false,
    },
    dateOfBirth: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty
          // Basic validation for MM/DD/YYYY format
          const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
          return dateRegex.test(v);
        },
        message: 'Date of birth must be in MM/DD/YYYY format'
      }
    },
    profilePic: {
      type: {
        key: String,
        url: String,
      },
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseSignInProvider: {
      type: String,
      required: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    walletAddress: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allow multiple null values
      trim: true,
    },
    hashedKey: {
      type: String,
      required: false,
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
