// Defines the structure of statistical data
interface Statistics {
    nbUsers: number // Number of users
    nbProjects: Array<number> // Array containing the number of projects for each method
    nbVisits24h: number // Number of website visits in the last 24 hours
    nbProjects24h: number // Number of new projects created in the last 24 hours
  }
  
  // Message for informing users about the ban duration
  const banMsg: string =
    'The ban duration has not yet been completed. Please wait until the ban period expires before attempting to perform this action again.';
  
  // Validation schema for validating user ID
  const userIdValidationSchema = {
    id: {
      notEmpty: {
        errorMessage: "Must provide the id of the user"
      }
    }
  }
  
  // Validation schema for validating user ban duration
  const userBanValidationSchema = {
    id: {
      notEmpty: {
        errorMessage: "Must provide the id of the user"
      }
    },
    duration: {
      notEmpty: {
        errorMessage: "Must provide the duration of the ban"
      },
      isNumeric: {
        errorMessage: "The duration must be a number (of days)"
      }
    }
  }
  
  // Validation schema for validating tag type
  const tagTypeValidationSchema = {
    type: {
      notEmpty: {
        errorMessage: "Must provide the tag type"
      },
      isString: {
        errorMessage: "The tag type must be a string"
      }
    }
  }
  
  // Validation schema for validating tag ID and type
  const tagTypeIdValidationSchema = {
    id: {
      notEmpty: {
        errorMessage: "Must provide the id of the tag"
      }
    },
    type: {
      notEmpty: {
        errorMessage: "Must provide the tag type"
      },
      isString: {
        errorMessage: "The tag type must be a string"
      }
    }
  }
  
  // Validation schema for validating feedback ID and admin response
  const feedbackReplyValidationSchema = {
    id: {
      notEmpty: {
        errorMessage: "Must provide the id of the feedback"
      }
    },
    response: {
      notEmpty: {
        errorMessage: "Must provide the response of the admin"
      },
      isString: {
        errorMessage: "The response must be a string"
      }
    }
  }
  
  // Validation schema for validating project publication request ID in approve
  const publicProjectRequestApproveValidationSchema = {
    id: {
      notEmpty: {
        errorMessage: "Must provide the id of the project publication request"
      }
    }
  }
  
  // Exporting constants and interfaces for use in other parts of the application
  export {
    Statistics,
    banMsg,
    userIdValidationSchema,
    userBanValidationSchema,
    tagTypeValidationSchema,
    tagTypeIdValidationSchema,
    feedbackReplyValidationSchema,
    publicProjectRequestApproveValidationSchema
  }