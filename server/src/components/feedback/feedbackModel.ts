import mongoose , { Schema } from "mongoose";
import { feedbackInterface } from "./feedbackIntefrace";

const feedbackSchema = new Schema<feedbackInterface>({
  created_by: {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    profilePicUrl: {
      type: String
    }
  },
  title : {
    type: String,
    required: true
  },
  description : {
    type: String,
    required: true
  },
  creationDate : {
    type: Date,
    required: [true, 'feedback creation date is required']
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