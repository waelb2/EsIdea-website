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
exports.getProjectByUserId = exports.deleteProject = exports.updateProject = exports.createProject = void 0;
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
    const userId = '662bda8263ebf49a5dba18ba';
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
        const { projectTitle, description, templateId, ideationMethodId, visibility, collaborators, mainTopic, subTopics, tags } = req.body;
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
        let clubList = [];
        let moduleList = [];
        let eventList = [];
        for (const tag of tags) {
            const tagId = tag.tagId;
            const tagType = tag.tagType.toLowerCase();
            switch (tagType) {
                case 'club':
                    const club = yield clubModel_1.Club.findById(tagId);
                    if (!club) {
                        return res.status(404).json({
                            error: `Club ${tagId} not found `
                        });
                    }
                    clubList.push(club);
                    break;
                case 'module':
                    const module = yield moduleModel_1.Module.findById(tagId);
                    if (!module) {
                        return res.status(404).json({
                            error: `Module ${tagId} not found `
                        });
                    }
                    moduleList.push(module);
                    break;
                case 'event':
                    const event = yield eventModel_1.Event.findById(tagId);
                    if (!event) {
                        return res.status(404).json({
                            error: `Event ${tagId} not found `
                        });
                    }
                    eventList.push(event);
                    break;
                default:
                    return res.status(400).json({
                        error: 'Invalid association type'
                    });
            }
        }
        if (clubList.length == 0 &&
            moduleList.length == 0 &&
            eventList.length == 0) {
            return res.status(400).json({
                error: 'Either one club, module or event must be provided'
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
            clubs: clubList,
            modules: moduleList,
            events: eventList,
            thumbnailUrl: secureURL
        });
        const normalized_collaborators = collaborators.map(email => email.toLowerCase().trim());
        // creating and sending invitations
        const invitedUsers = yield userModels_1.User.find({
            email: { $in: normalized_collaborators }
        });
        // creating invitations
        for (const collaborator of normalized_collaborators) {
            const user = invitedUsers.find(user => user.email === collaborator);
            const currentDate = new Date();
            const expirationDate = new Date();
            expirationDate.setDate(currentDate.getDate() + 3);
            const invitation = yield invitationModel_1.Invitation.create({
                senderId: coordinator.id,
                receiverId: user ? user.id : null,
                receiverEmail: collaborator,
                projectId: project.id,
                invitationDate: currentDate,
                expiresAt: expirationDate
            });
            // Associating project with his coordinator
            coordinator.projects.push({ project, joinedAt: new Date() });
            user === null || user === void 0 ? void 0 : user.projectInvitations.push(invitation);
            user === null || user === void 0 ? void 0 : user.save();
            //sending the invitation email
            (0, sendInvitationEmail_1.default)(coordinator.lastName + ' ' + coordinator.firstName, user === null || user === void 0 ? void 0 : user.id, collaborator, project.id, project.title, invitation.id);
        }
        return res.status(201).json({
            success: 'Project created successfully'
        });
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
    const userId = '65ef22333d0a83e5abef43fd';
    const { projectId } = req.params;
    try {
        if (!projectId) {
            return res.status(400).json({
                error: 'Project ID must be provided'
            });
        }
        if (!userId) {
            return res.status(400).json({
                error: 'User ID must be provided'
            });
        }
        const collaborator = yield userModels_1.User.findById(userId);
        if (!collaborator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        const collaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() === userId);
        if (collaborators.length < 0) {
            return res.status(400).json({
                error: 'This user is not a collaborator in this project'
            });
        }
        const updatedCollaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() !== userId);
        // deleting the collaborator from project collaborators list
        project.collaborators = updatedCollaborators;
        project.save();
        const updatedProjectsList = collaborator.projects.filter(collaboratorProject => console.log(collaboratorProject)
        //collaboratorProject.project._id.toString() !== projectId
        );
        // deleting the project from user projects list
        collaborator.projects = updatedProjectsList;
        collaborator.save();
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteProject = deleteProject;
const getProjectByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    try {
        if (!userId) {
            return res.status(400).json({
                error: 'User ID must be provided'
            });
        }
        const user = yield userModels_1.User.findById(userId)
            .populate({
            path: 'projects.project',
            populate: {
                path: 'subTopics', // Populate the `subTopics` array for each project
                model: 'Topic' // Specify the model for `subTopics` (adjust based on your schema)
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'collaborators.member',
                model: 'User'
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'mainTopic',
                model: 'Topic'
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'clubs',
                model: 'Club'
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'events',
                model: 'Event'
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'modules',
                model: 'Module'
            }
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        const projects = user.projects.map(project => project === null || project === void 0 ? void 0 : project.project);
        const projectStrings = projects.map(project => {
            const { title, description, visibility, collaboratorsCount, collaborators, mainTopic, subTopics, clubs, modules, events, thumbnailUrl } = project;
            const formattedSubTopics = subTopics === null || subTopics === void 0 ? void 0 : subTopics.map(topic => topic.topicName);
            const formattedCollaborators = collaborators === null || collaborators === void 0 ? void 0 : collaborators.map(collaborator => {
                if (collaborator.member) {
                    const { firstName, lastName, email, profilePicUrl } = collaborator.member;
                    return {
                        firstName,
                        lastName,
                        email,
                        profilePicUrl
                    };
                }
                return null;
            });
            const formattedProject = {
                ProjectTitle: title,
                Description: description,
                Visibility: visibility,
                CollaboratorsCount: collaboratorsCount.toString(),
                collaborators: formattedCollaborators,
                MainTopic: (mainTopic === null || mainTopic === void 0 ? void 0 : mainTopic.topicName) || '',
                SubTopics: formattedSubTopics,
                Clubs: clubs.map(club => club.clubName),
                Modules: modules.map(module => module.moduleName),
                Events: events.map(event => event.eventName),
                ThumbnailUrl: thumbnailUrl
            };
            return formattedProject;
        });
        res.status(200).json(projectStrings);
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getProjectByUserId = getProjectByUserId;
