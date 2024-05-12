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
exports.deleteIdea = exports.postIdea = exports.getIdeasByProject = void 0;
const ideaModels_1 = require("./ideaModels");
const userModels_1 = require("../user/userModels");
const projectModels_1 = require("../project/projectModels");
const topicModel_1 = require("../project/topicModel");
const getIdeasByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({
                error: 'Project ID must be provided'
            });
        }
        const ideas = yield ideaModels_1.Idea.find({
            projectId
        })
            .populate('topic')
            .populate('createdBy');
        const formattedIdeas = ideas.map(idea => {
            const formattedIdea = {
                ideaId: idea.id,
                content: idea.content,
                createdBy: {
                    firstName: idea.createdBy.firstName,
                    lastName: idea.createdBy.lastName,
                    email: idea.createdBy.email,
                    profilePicUrl: idea.createdBy.profilePicUrl
                },
                createdAt: idea.creationDate,
                votes: idea.votes,
                isBold: idea.isBold,
                isItalic: idea.isItalic
            };
            return formattedIdea;
        });
        res.status(201).json(formattedIdeas);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.getIdeasByProject = getIdeasByProject;
const postIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = '662d1119ace155f48b676a7d'
        const { userId } = req.user;
        const user = yield userModels_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: `User with id : ${userId} does not exist`
            });
        }
        const { projectId, topicId, content, isBold, isItalic, color, selected } = req.body;
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: `Project with id : ${projectId} does not exist`
            });
        }
        ;
        (yield project.populate('collaborators.member')).populate('coordinator');
        const collaboratorIds = project.collaborators.map(collaborator => {
            const objectId = collaborator.member._id;
            return objectId.toString();
        });
        collaboratorIds.push(project.coordinator._id.toString());
        const foundUsers = collaboratorIds.filter(collaboratorId => collaboratorId === userId);
        if (foundUsers.length === 0) {
            return res.status(401).json({
                error: `User with ID ${userId} is unauthorized to collaborate on this project`
            });
        }
        const topic = yield topicModel_1.Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({
                error: `Topic with id : ${topicId} does not exist`
            });
        }
        const createdIdea = yield ideaModels_1.Idea.create({
            projectId: project,
            createdBy: user,
            topic,
            content,
            creationDate: new Date(),
            isBold,
            isItalic,
            color,
        });
        (yield createdIdea.populate('topic')).populate('createdBy');
        if (!createdIdea) {
            return res.status(500).json({
                error: 'Error posting the idea'
            });
        }
        project.ideas.push(createdIdea);
        project.save();
        const author = {
            firstName: user.firstName,
            email: user.email,
            profilePicUrl: user.profilePicUrl
        };
        const formattedIdea = {
            ideaId: createdIdea.id,
            createdBy: author,
            topic: createdIdea.topic.topicName,
            content: createdIdea.content,
            creationDate: createdIdea.creationDate
        };
        res.status(201).json(formattedIdea);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.postIdea = postIdea;
const deleteIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ideaId } = req.params;
        if (!ideaId) {
            return res.status(400).json({
                error: 'Idea ID must be provided'
            });
        }
        const deletedIdea = yield ideaModels_1.Idea.findOneAndDelete({
            _id: ideaId
        });
        if (!deletedIdea) {
            return res.status(404).json({
                error: 'Idea not found'
            });
        }
        const projectId = deletedIdea.projectId;
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        const projectIdeas = project.ideas;
        const newIdeasList = projectIdeas.filter(idea => idea._id !== ideaId);
        project.ideas = newIdeasList;
        project.save();
        return res.status(200).json({
            msg: 'Idea deleted successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal server error '
        });
    }
});
exports.deleteIdea = deleteIdea;
