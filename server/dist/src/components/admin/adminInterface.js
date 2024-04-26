"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProjectRequestApproveValidationSchema = exports.feedbackReplyValidationSchema = exports.tagTypeIdValidationSchema = exports.tagTypeValidationSchema = exports.userBanValidationSchema = exports.userIdValidationSchema = exports.banMsg = void 0;
const banMsg = 'The ban duration has not yet been completed. Please wait until the ban period expires before attempting to perform this action again.';
exports.banMsg = banMsg;
const userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    }
};
exports.userIdValidationSchema = userIdValidationSchema;
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
};
exports.userBanValidationSchema = userBanValidationSchema;
const tagTypeValidationSchema = {
    type: {
        notEmpty: {
            errorMessage: "Must provide the tag type"
        },
        isString: {
            errorMessage: "The tag type must be a string"
        }
    }
};
exports.tagTypeValidationSchema = tagTypeValidationSchema;
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
};
exports.tagTypeIdValidationSchema = tagTypeIdValidationSchema;
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
};
exports.feedbackReplyValidationSchema = feedbackReplyValidationSchema;
const publicProjectRequestApproveValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the project publication request"
        }
    }
};
exports.publicProjectRequestApproveValidationSchema = publicProjectRequestApproveValidationSchema;
