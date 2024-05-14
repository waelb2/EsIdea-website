import mongoose, { Schema } from 'mongoose'
import { UserInterface } from './userInterface'
import validator from 'validator'
import crypto from 'crypto'
/**
 * Enum representing user roles.
 */
enum UserRole {
  ADMIN = 'admin', // Admin role.
  USER = 'user' // User role.
}

/**
 * Schema definition for User documents.
 */
const userSchema = new Schema<UserInterface>({
  firstName: {
    type: String,
    required: [true, 'First name is required'] // Validation for required first name.
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'] // Validation for required last name.
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Validation for required email.
    unique: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value), // Validation for email format.
      message: 'Invalid email format.'
    }
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long.'] // Validation for minimum password length.
  },
  profilePicUrl: {
    type: String // Profile picture URL.
  },
  role: {
    type: String,
    enum: Object.values(UserRole), // Enum validation for user role.
    default: UserRole.USER // Default role is USER.
  },
  joinDate: {
    type: Date,
    required: [true, 'User joining date is required'] // Validation for required join date.
  },
  projects: [
    {
      project: {
        type: mongoose.Types.ObjectId,
        ref: 'Project'
      },
      joinedAt: Date,
      isTrashed: {
        type: Boolean,
        default: false // Default value for isTrashed.
      },
      isFav: {
        type: Boolean,
        default: false // Default value for isFav.
      }
    }
  ],
  projectInvitations: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Invitation'
    }
  ],
  ban: {
    isBan: {
        type : Schema.Types.Boolean,
        default : false // Default value for isBan.
    },
    banEnd: Date // Date when ban ends.
  },
  passwordResetToken: [
    {
      type: String // Password reset token.
    }
  ],
  passwordResetTokenExpires: [
    {
      type: Date // Date when password reset token expires.
    }
  ]
})

/**
 * Method to generate a reset password token for the user.
 */
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex') // Generate random token.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex') // Hash the token.
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000 // Set token expiration.
  return resetToken // Return the token.
}

/**
 * Model for User documents.
 */
const User = mongoose.model<UserInterface>('User', userSchema)

/**
 * Validation schema for user ID.
 */
const userIdValidationSchema = {
  id: {
    notEmpty: {
      errorMessage: 'Must provide the id of the user' // Error message for missing user ID.
    }
  }
}

/**
 * Validation schema for adding a favorite project.
 */
const addFavouriteProjectValidationSchema = {
    projectId: {
        notEmpty: {
            errorMessage: "Must provide the id of the project" // Error message for missing project ID.
        }
    }
}

export { User, UserRole, userIdValidationSchema, addFavouriteProjectValidationSchema }
