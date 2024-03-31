import mongoose , {Schema, mongo} from "mongoose";
import { InvitationInterface } from "./invitationInterface";


const invitationSchema = new Schema<InvitationInterface>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    expiresAt : Date,
    accepted: {
        type: Boolean,
        default: false
    },
})


const Invitation = mongoose.model<InvitationInterface>('Invitation', invitationSchema)

export {Invitation}

