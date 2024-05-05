import mongoose, { Schema } from "mongoose";
import { UserInterface } from "./userInterface";
import validator from 'validator';
import crypto from 'crypto';
enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

const userSchema = new Schema<UserInterface>({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email format.',
        }
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long.'],
    },
    profilePicUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    joinDate: {
        type: Date,
        required: [true, "User joining date is required"]
    },
    projects: [{
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project',
        },
        joinedAt: Date,
        isTrashed: {
            type: Boolean,
            default: false
        },
        isFav: {
            type: Boolean,
            default: false
        }
    }],
    projectInvitations: [{
        type: mongoose.Types.ObjectId,
        ref: 'Invitation'
    }],
    passwordResetToken: [{
        type: String,

    }],
    passwordResetTokenExpires: [{
        type: Date,

    }],
})

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;

}

const User = mongoose.model<UserInterface>('User', userSchema);

const userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    }
}

const addFavouriteProjectValidationSchema = {
    userId: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    },
    projectId: {
        notEmpty: {
            errorMessage: "Must provide the id of the project"
        }
    }
}

export { User, UserRole, userIdValidationSchema, addFavouriteProjectValidationSchema }


