export const userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    }
}

export const userBanValidationSchema = {
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

export const tagTypeValidationSchema = {
    type: {
        notEmpty: {
            errorMessage: "Must provide the tag type"
        },
        isString: {
            errorMessage: "The tag type must be a string"
        }
    }
}

export const tagTypeIdValidationSchema = {
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

export const feedbackReplyValidationSchema = {
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

export const publicProjectRequestApproveValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the project publication request"
        }
    }
}