import { Document, Model } from 'mongoose'
import { ProjectInterface } from '../project/projectInterface'
import { InvitationInterface } from '../invitation/invitationInterface'

export interface UserInterface extends Document {
  firstName: string
  lastName: string
  email: string
  password?: string
  profilePicUrl?: string
  role: string
  joinDate: Date
  projects: {
    project: ProjectInterface
    joinedAt: Date
  }[]
  googleId: string
  projectInvitations: InvitationInterface[]
}
