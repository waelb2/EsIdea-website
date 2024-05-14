import { Document } from 'mongoose'
import { UserInterface } from '../user/userInterface'
import { ProjectInterface } from '../project/projectInterface'

// Interface for invitation documents
export interface InvitationInterface extends Document {
  senderId: UserInterface // The ID of the user who sent the invitation
  receiverId: UserInterface // The ID of the user who received the invitation
  receiverEmail: string // Email of the user who received the invitation
  projectId: ProjectInterface // The ID of the project related to the invitation
  invitationDate: Date // Date when the invitation was sent
  expiresAt: Date // Date when the invitation expires
  accepted: boolean // Flag indicating if the invitation has been accepted
}
