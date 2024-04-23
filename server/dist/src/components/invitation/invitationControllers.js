"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitation = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const invitationModel_1 = require("./invitationModel");
const projectModels_1 = require("../project/projectModels");
const userModels_1 = require("../user/userModels");
const acceptInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invitationToken = req.query.token;
    try {
        if (!invitationToken) {
            return res.status(403).json({
                error: 'Invalid invitation url'
            });
        }
        const invitationPayload = (0, jsonwebtoken_1.verify)(invitationToken, process.env.JWT_SECRET_EMAIL);
        const { userId, exp, projectId, invitationId } = invitationPayload;
        if (exp > Date.now()) {
            return res.status(403).json({
                error: 'Invitation has expired'
            });
        }
        const invitation = yield invitationModel_1.Invitation.findByIdAndUpdate(invitationId, {
            accepted: true
        });
        if (!invitation) {
            return res.status(404).json({
                error: 'Invitation has been accepted'
            });
        }
        const updatedProject = yield projectModels_1.Project.findByIdAndUpdate(projectId, {
            $addToSet: { collaborators: yield userModels_1.User.findById(userId) },
            $inc: { collaboratorsCount: 1 }
        }, { new: true });
        if (!updatedProject) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        res.status(201).json({
            msg: 'Invitation accepted successfully'
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.acceptInvitation = acceptInvitation;
