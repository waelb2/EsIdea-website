import mongoose, { Schema } from 'mongoose'
import { InvitationInterface } from './invitationInterface'

// Define the schema for invitations
const invitationSchema = new Schema<InvitationInterface>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Invitation sender must be provided']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverEmail: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Receiver email must be provided']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  invitationDate: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  accepted: {
    type: Boolean,
    default: false
  }
})

// Create the Invitation model from the schema
const Invitation = mongoose.model<InvitationInterface>('Invitation', invitationSchema)

export { Invitation }
