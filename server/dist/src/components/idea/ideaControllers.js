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
// Function to get ideas by project ID
const getIdeasByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        // Check if projectId is provided
        if (!projectId) {
            return res.status(400).json({
                error: 'Project ID must be provided'
            });
        }
        // Find ideas by project ID and populate related fields
        const ideas = yield ideaModels_1.Idea.find({
            projectId
        })
            .populate('topic')
            .populate('createdBy');
        // Format retrieved ideas
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
                isItalic: idea.isItalic,
                color: idea.color
            };
            return formattedIdea;
        });
        // Send the formatted ideas as response
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
// Function to post a new idea
const postIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const user = yield userModels_1.User.findById(userId);
        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                error: `User with id : ${userId} does not exist`
            });
        }
        // Destructure request body
        const { projectId, topicId, content, isBold, isItalic, color, selected } = req.body;
        // Find project by ID
        const project = yield projectModels_1.Project.findById(projectId);
        // Check if the project exists
        if (!project) {
            return res.status(404).json({
                error: `Project with id : ${projectId} does not exist`
            });
        }
        // Populate collaborators and coordinator fields
        ;
        (yield project.populate('collaborators.member')).populate('coordinator');
        // Extract collaborator IDs
        const collaboratorIds = project.collaborators.map(collaborator => {
            const objectId = collaborator.member._id;
            return objectId.toString();
        });
        collaboratorIds.push(project.coordinator._id.toString());
        // Check if the user is authorized to collaborate on the project
        const foundUsers = collaboratorIds.filter(collaboratorId => collaboratorId === userId);
        if (foundUsers.length === 0) {
            return res.status(401).json({
                error: `User with ID ${userId} is unauthorized to collaborate on this project`
            });
        }
        // Find topic by ID
        const topic = yield topicModel_1.Topic.findById(topicId);
        // Check if the topic exists
        if (!topic) {
            return res.status(404).json({
                error: `Topic with id : ${topicId} does not exist`
            });
        }
        // Create a new idea
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
        // Handle errors
        if (!createdIdea) {
            return res.status(500).json({
                error: 'Error posting the idea'
            });
        }
        // Update project with the new idea
        project.ideas.push(createdIdea);
        project.save();
        // Format author data
        const author = {
            firstName: user.firstName,
            email: user.email,
            profilePicUrl: user.profilePicUrl
        };
        // Format the created idea and send as response
        const formattedIdea = {
            ideaId: createdIdea.id,
            createdBy: author,
            topic: createdIdea.topic.topicName,
            content: createdIdea.content,
            creationDate: createdIdea.creationDate,
            isBold: createdIdea.isBold,
            isItalic: createdIdea.isItalic,
            color: createdIdea.color
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
// Function to delete an idea
const deleteIdea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ideaId } = req.params;
        // Check if idea ID is provided
        if (!ideaId) {
            return res.status(400).json({
                error: 'Idea ID must be provided'
            });
        }
        // Find and delete the idea
        const deletedIdea = yield ideaModels_1.Idea.findOneAndDelete({
            _id: ideaId
        });
        // Handle errors if idea is not found
        if (!deletedIdea) {
            return res.status(404).json({
                error: 'Idea not found'
            });
        }
        // Find the project associated with the idea
        const projectId = deletedIdea.projectId;
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        // Remove the idea from the project's ideas list and save the project
        const projectIdeas = project.ideas;
        const newIdeasList = projectIdeas.filter(idea => idea._id !== ideaId);
        project.ideas = newIdeasList;
        project.save();
        // Send success message
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
