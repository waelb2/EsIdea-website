import { Document, Model } from 'mongoose'
import { ProjectInterface } from '../project/projectInterface'
import { InvitationInterface } from '../invitation/invitationInterface'

/**
 * Interface for User documents.
 */
export interface UserInterface extends Document {
  firstName: string; // User's first name.
  lastName: string; // User's last name.
  email: string; // User's email address.
  password?: string; // User's password (optional).
  profilePicUrl?: string; // URL of user's profile picture (optional).
  role: string; // User's role.
  joinDate: Date; // Date when the user joined.
  projects: {
    project: ProjectInterface; // Project the user is associated with.
    joinedAt: Date; // Date when the user joined the project.
    isTrashed: boolean; // Indicates if the project is trashed.
    isFav: boolean; // Indicates if the project is marked as favorite.
  }[]; // Array of projects associated with the user.
  googleId: string; // Google ID of the user.
  projectInvitations: InvitationInterface[]; // Array of project invitations received by the user.
  ban: {
    isBan: boolean; // Indicates if the user is banned.
    banEnd: Date; // Date when the ban ends.
  }; // Object containing ban details.
  passwordResetToken?: string; // Token for resetting the user's password (optional).
  passwordResetTokenExpires?: Date; // Date when the password reset token expires (optional).
  createResetPasswordToken: Function; // Function to create a reset password token.
}
