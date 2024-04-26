import { Document } from 'mongoose'
import { UserInterface } from '../user/userInterface'
import { ProjectInterface } from '../project/projectInterface'

export interface InvitationInterface extends Document {
  senderId: UserInterface
  receiverId: UserInterface
  receiverEmail: string
  projectId: ProjectInterface
  invitationDate: Date
  expiresAt: Date
  accepted: boolean
}
