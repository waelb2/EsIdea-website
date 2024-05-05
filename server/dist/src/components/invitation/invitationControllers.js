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
        const { userId, projectId, invitationId } = invitationPayload;
        const invitation = yield invitationModel_1.Invitation.findById(invitationId);
        if ((invitation === null || invitation === void 0 ? void 0 : invitation.accepted) || !invitation) {
            return res.status(404).json({
                error: 'Invitation has been accepted'
            });
        }
        if (invitation.expiresAt.getTime() <= Date.now()) {
            return res.status(403).json({
                error: 'Invitation has expired'
            });
        }
        invitation.accepted = true;
        invitation.save();
        const user = yield userModels_1.User.findById(userId);
        if (user) {
            const updatedProject = yield projectModels_1.Project.findByIdAndUpdate(projectId, {
                $addToSet: {
                    collaborators: {
                        member: user,
                        joinedAt: new Date()
                    }
                },
                $inc: { collaboratorsCount: 1 }
            }, { new: true });
            if (!updatedProject) {
                return res.status(404).json({
                    error: 'Error updating the project or the project does not exist'
                });
            }
        }
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.json(404).json({
                error: 'Project not found'
            });
        }
        user === null || user === void 0 ? void 0 : user.projects.push({
            project: project,
            joinedAt: new Date(),
            isTrashed: false
        });
        const updateUser = yield userModels_1.User.findByIdAndUpdate(userId, {
            $addToSet: {
                projects: {
                    project: yield projectModels_1.Project.findById(projectId),
                    joinedAt: new Date()
                }
            },
            $inc: { collaboratorsCount: 1 }
        }, { new: true });
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
