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
exports.UserRole = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
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
            validator: (value) => validator_1.default.isEmail(value),
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
                type: mongoose_1.default.Types.ObjectId,
                ref: 'Project',
            },
            joinedAt: Date,
        }],
    projectInvitations: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Invitation'
        }]
});
// userSchema.pre('save', async function (next) { // this is only used before adding the doc to db, since we r using google sign up, it wont be fired
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(String(this.password), salt);
//     next();
//   });
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
