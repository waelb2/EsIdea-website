"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicProjectRequestApproveValidationSchema = exports.feedbackReplyValidationSchema = exports.tagTypeIdValidationSchema = exports.tagTypeValidationSchema = exports.userBanValidationSchema = exports.userIdValidationSchema = void 0;
exports.userIdValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the user"
        }
    }
};
exports.userBanValidationSchema = {
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
exports.tagTypeValidationSchema = {
    type: {
        notEmpty: {
            errorMessage: "Must provide the tag type"
        },
        isString: {
            errorMessage: "The tag type must be a string"
        }
    }
};
exports.tagTypeIdValidationSchema = {
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
exports.feedbackReplyValidationSchema = {
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
exports.publicProjectRequestApproveValidationSchema = {
    id: {
        notEmpty: {
            errorMessage: "Must provide the id of the project publication request"
        }
    }
};
