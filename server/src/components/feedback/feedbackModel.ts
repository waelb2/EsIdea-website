import mongoose , { Schema } from "mongoose";
import { feedbackInterface } from "./feedbackIntefrace";
import { isString } from "util";

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

const createFeedbackValidationSchema = {
  title: {
    isString: {
      errorMessage: "The title of the feedback must be a string"
    },
    notEmpty: {
      errorMessage: "Must provide the title of feedback"
    }
  },
  description: {
    isString: {
      errorMessage: "The feedback must be a string"
    },
    notEmpty: {
      errorMessage: "Must provide the feedback of the user"
    }
  }
}

export { feedback, createFeedbackValidationSchema }