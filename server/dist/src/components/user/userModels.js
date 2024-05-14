"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavouriteProjectValidationSchema = exports.userIdValidationSchema = exports.UserRole = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Enum representing user roles.
 */
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user"; // User role.
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Schema definition for User documents.
 */
const userSchema = new mongoose_1.Schema({
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
            validator: (value) => validator_1.default.isEmail(value), // Validation for email format.
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
                type: mongoose_1.default.Types.ObjectId,
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
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Invitation'
        }
    ],
    ban: {
        isBan: {
            type: mongoose_1.Schema.Types.Boolean,
            default: false // Default value for isBan.
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
});
/**
 * Method to generate a reset password token for the user.
 */
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex'); // Generate random token.
    this.passwordResetToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'); // Hash the token.
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // Set token expiration.
    return resetToken; // Return the token.
};
/**
 * Model for User documents.
 */
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
/**
 * Validation schema for user ID.
 */
const userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: 'Must provide the id of the user' // Error message for missing user ID.
        }
    }
};
exports.userIdValidationSchema = userIdValidationSchema;
/**
 * Validation schema for adding a favorite project.
 */
const addFavouriteProjectValidationSchema = {
    projectId: {
        notEmpty: {
            errorMessage: "Must provide the id of the project" // Error message for missing project ID.
        }
    }
};
exports.addFavouriteProjectValidationSchema = addFavouriteProjectValidationSchema;
