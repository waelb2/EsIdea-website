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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = void 0;
const projectModels_1 = require("./projectModels");
const userModels_1 = require("../user/userModels");
const templateModel_1 = __importDefault(require("../template/templateModel"));
const ideationMethodModel_1 = require("../idea/ideationMethodModel");
const topicModel_1 = require("./topicModel");
const clubModel_1 = require("../club/clubModel");
const moduleModel_1 = require("../module/moduleModel");
const eventModel_1 = require("../event/eventModel");
const invitationModel_1 = require("../invitation/invitationModel");
const sendInvitationEmail_1 = __importDefault(require("../../utils/sendInvitationEmail"));
const cloudConfig_1 = __importDefault(require("../../config/cloudConfig"));
const fs_1 = __importDefault(require("fs"));
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const {userId} = req.user
    const userId = '65ef22333d0a83e5abef43e3';
    let secureURL = '';
    try {
        if (req.file) {
            const cloudImage = yield cloudConfig_1.default.uploader.upload(req.file.path, {
                folder: 'projectThumbnails'
            });
            secureURL = cloudImage.secure_url;
            fs_1.default.unlinkSync(req.file.path);
        }
        let projectAssociation;
        const { projectTitle, description, templateId, ideationMethodId, visibility, collaborators, mainTopic, subTopics, association, associationId } = req.body;
        // Getting and validating project metadata
        const coordinator = yield userModels_1.User.findById(userId);
        if (!coordinator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        const template = yield templateModel_1.default.findById(templateId);
        if (!template) {
            return res.status(404).json({
                error: 'Template not found'
            });
        }
        const ideationMethod = yield ideationMethodModel_1.IdeationMethod.findById(ideationMethodId);
        if (!ideationMethod) {
            return res.status(404).json({
                error: 'Ideation method not found'
            });
        }
        const parentTopic = yield topicModel_1.Topic.create({
            topicName: mainTopic,
            parentTopic: null
        });
        let subTopicsIds = [];
        for (const topic of subTopics) {
            const subTopic = yield topicModel_1.Topic.create({
                topicName: topic,
                parentTopic: parentTopic.id
            });
            subTopicsIds.push(subTopic.id);
        }
        let associationData;
        projectAssociation = association.toLowerCase();
        switch (projectAssociation) {
            case 'club':
                associationData = yield clubModel_1.Club.findById(associationId);
                if (!associationData) {
                    return res.status(404).json({
                        error: 'Club not found '
                    });
                }
                break;
            case 'module':
                associationData = yield moduleModel_1.Module.findById(associationId);
                if (!associationData) {
                    return res.status(404).json({
                        error: 'Module not found '
                    });
                }
                break;
            case 'event':
                associationData = yield eventModel_1.Event.findById(associationId);
                if (!associationData) {
                    return res.status(404).json({
                        error: 'Event not found '
                    });
                }
                break;
            default:
                return res.status(400).json({
                    error: 'Invalid association type'
                });
        }
        // creating the project document
        const project = yield projectModels_1.Project.create({
            title: projectTitle,
            description: description,
            coordinator: coordinator.id,
            template: template.id,
            ideationMethod: ideationMethod.id,
            visibility,
            mainTopic: parentTopic.id,
            subTopics: subTopicsIds,
            club: projectAssociation === 'club' ? associationData.id : null,
            module: projectAssociation === 'module' ? associationData.id : null,
            event: projectAssociation === 'event' ? associationData.id : null,
            thumbnailUrl: secureURL
        });
        // creating and sending invitations
        const invitedUsers = yield userModels_1.User.find({
            email: { $in: collaborators }
        });
        // creating invitations
        for (const collaborator of collaborators) {
            const user = invitedUsers.find(user => user.email === collaborator);
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setDate(expirationDate.getDate() + 3);
            const invitation = yield invitationModel_1.Invitation.create({
                senderId: coordinator.id,
                receiverId: user ? user.id : null,
                receiverEmail: collaborator,
                projectId: project.id,
                invitationDate: currentDate,
                expiresAt: expirationDate
            });
            //sending the invitation email
            (0, sendInvitationEmail_1.default)(coordinator.lastName + ' ' + coordinator.firstName, user === null || user === void 0 ? void 0 : user.id, collaborator, project.id, project.title, invitation.id);
            return res.status(201).json({
                success: 'Project created successfully'
            });
        }
    }
    catch (err) {
        console.log('Error : ', err);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
exports.createProject = createProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = '65ef22333d0a83e5abef440e';
    const { projectId } = req.params;
    try {
        if (!projectId) {
            return res.status(400).json({
                error: 'Project ID must be provided'
            });
        }
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        if (project.coordinator.toString() !== userId) {
            return res.status(403).json({
                error: 'Unauthorized - Only project coordinator can update the project'
            });
        }
        const { title, description, status } = req.body;
        project.title = title;
        project.description = description;
        project.status = status;
        yield project.save();
        res.status(200).json({ message: 'Project updated successfully' });
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = '65ef22333d0a83e5abef440e';
    const { projectId } = req.params;
    try {
        if (!projectId) {
            return res.status(400).json({
                error: 'Project ID must be provided'
            });
        }
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        const user = yield userModels_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        console.log(project.collaborators);
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteProject = deleteProject;
