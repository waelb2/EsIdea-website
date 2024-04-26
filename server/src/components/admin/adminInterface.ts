interface Statistics {
  nbUsers: number
  nbProjects: Array<number>
  nbVisits24h: number
  nbProjects24h: number
}

const banMsg: string =
  'The ban duration has not yet been completed. Please wait until the ban period expires before attempting to perform this action again.'

const userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    }
}

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
            errorMessage: "The duaration must be a number (of days)"
        }
    }
}

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

const publicProjectRequestApproveValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the project publication request"
        }
    }
}

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