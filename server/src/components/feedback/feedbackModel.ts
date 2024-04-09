import mongoose , { Schema } from "mongoose";
import { feedbackInterface } from "./feedbackIntefrace";

const feedbackSchema = new Schema<feedbackInterface>({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title : {
    type: String,
    required: true
  },
  description : {
    type: String,
    required: true
  },
  adminResponse : {
    type: String,
    default: ""
  }
});


const feedback = mongoose.model<feedbackInterface>('feedback', feedbackSchema)

export { feedback }