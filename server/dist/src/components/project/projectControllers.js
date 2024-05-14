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
exports.updateProjectStatus = exports.deleteProjectManyIdeas = exports.restoreProject = exports.trashProject = exports.getProjectByUserId = exports.deleteProject = exports.updateProject = exports.createProject = void 0;
const projectModels_1 = require("./projectModels");
const userModels_1 = require("../user/userModels");
const ideationMethodModel_1 = require("../idea/ideationMethodModel");
const topicModel_1 = require("./topicModel");
const clubModel_1 = require("../club/clubModel");
const moduleModel_1 = require("../module/moduleModel");
const eventModel_1 = require("../event/eventModel");
const invitationModel_1 = require("../invitation/invitationModel");
const sendInvitationEmail_1 = __importDefault(require("../../utils/sendInvitationEmail"));
const cloudConfig_1 = __importDefault(require("../../config/cloudConfig"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const ideaModels_1 = require("../idea/ideaModels");
// Controller function to create a project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    let secureURL = '';
    try {
        // Handling file upload (thumbnail)
        if (req.file) {
            const cloudImage = yield cloudConfig_1.default.uploader.upload(req.file.path, {
                folder: 'projectThumbnails'
            });
            secureURL = cloudImage.secure_url;
            fs_1.default.unlinkSync(req.file.path);
        }
        // Destructuring request body
        const { projectTitle, description, ideationMethodName, collaborators, mainTopic, subTopics, tags, timer } = req.body;
        // Getting and validating project metadata
        // Finding the coordinator (user who is creating the project)
        const coordinator = yield userModels_1.User.findById(userId);
        if (!coordinator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        // Finding the ideation method for the project
        const ideationMethod = yield ideationMethodModel_1.IdeationMethod.findOne({
            methodName: { $regex: ideationMethodName, $options: 'i' }
        });
        if (!ideationMethod) {
            return res.status(404).json({
                error: 'Ideation method not found'
            });
        }
        // Creating main topic for the project
        const parentTopic = yield topicModel_1.Topic.create({
            topicName: mainTopic,
            parentTopic: null
        });
        let subTopicsIds = [];
        // Creating sub topics for the project
        if (subTopics) {
            for (const topic of subTopics) {
                const subTopic = yield topicModel_1.Topic.create({
                    topicName: topic,
                    parentTopic: parentTopic.id
                });
                subTopicsIds.push(subTopic.id);
            }
        }
        let clubList = [];
        let moduleList = [];
        let eventList = [];
        // Processing tags (clubs, modules, events)
        const formattedTags = tags.map(tag => JSON.parse(tag));
        for (const tag of formattedTags) {
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
        // Checking if at least one club, module or event is provided
        if (clubList.length == 0 &&
            moduleList.length == 0 &&
            eventList.length == 0) {
            return res.status(400).json({
                error: 'Either one club, module or event must be provided'
            });
        }
        // Creating the project document
        const project = yield projectModels_1.Project.create({
            title: projectTitle,
            description: description,
            coordinator: coordinator.id,
            ideationMethod: ideationMethod.id,
            mainTopic: parentTopic.id,
            subTopics: subTopicsIds,
            clubs: clubList,
            modules: moduleList,
            events: eventList,
            thumbnailUrl: secureURL,
            timer
        });
        // Normalizing collaborators' emails
        const normalized_collaborators = collaborators.map(email => email.toLowerCase().trim());
        // Finding invited users
        const invitedUsers = yield userModels_1.User.find({
            email: { $in: normalized_collaborators }
        });
        // Creating invitations and sending emails
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
            // Associating project with the coordinator
            coordinator.projects.push({
                project,
                joinedAt: new Date(),
                isTrashed: false,
                isFav: false
            });
            yield coordinator.save();
            user === null || user === void 0 ? void 0 : user.projectInvitations.push(invitation);
            user === null || user === void 0 ? void 0 : user.save();
            // Sending the invitation email
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
// Controller function to update a project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { projectId } = req.params;
    let secureURL = '';
    try {
        // Handling file upload (thumbnail)
        if (req.file) {
            const cloudImage = yield cloudConfig_1.default.uploader.upload(req.file.path, {
                folder: 'projectThumbnails'
            });
            secureURL = cloudImage.secure_url;
            fs_1.default.unlinkSync(req.file.path);
        }
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
        const { title, description } = req.body;
        if (title)
            project.title = title;
        if (description)
            project.description = description;
        if (secureURL)
            project.thumbnailUrl = secureURL;
        yield project.save();
        res.status(200).json({ message: 'Project updated successfully' });
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateProject = updateProject;
// Controller function to update project status
const updateProjectStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
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
        const { newStatus } = req.body;
        if (newStatus) {
            project.status = newStatus;
        }
        yield project.save();
        res.status(200).json({ message: 'Project status updated successfully' });
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateProjectStatus = updateProjectStatus;
// Controller function to delete a project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { projectId } = req.params;
    try {
        // Validating project ID
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
        // Finding the collaborator
        const collaborator = yield userModels_1.User.findById(userId);
        if (!collaborator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        // Finding the project
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        // Checking if the user is a collaborator in this project
        const collaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() === userId);
        if (collaborators.length < 0) {
            return res.status(400).json({
                error: 'This user is not a collaborator in this project'
            });
        }
        // Removing the collaborator from project collaborators list
        const updatedCollaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() !== userId);
        project.collaborators = updatedCollaborators;
        project.save();
        // Removing the project from user projects list
        const updatedProjectsList = collaborator.projects.filter(collaboratorProject => collaboratorProject.project._id.toString() !== projectId);
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
// Controller function to trash a project
const trashProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { projectId } = req.params;
    try {
        // Validating project ID
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
        // Finding the collaborator
        const collaborator = yield userModels_1.User.findById(userId);
        if (!collaborator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        // Finding the project
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        // Checking if the user is a collaborator in this project
        const collaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() === userId);
        if (collaborators.length < 0) {
            return res.status(400).json({
                error: 'This user is not a collaborator in this project'
            });
        }
        // Updating the project's trashed status
        const projectIndex = collaborator.projects.findIndex(project => project.project.toString() === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({
                error: "Project not found in the user's project list"
            });
        }
        collaborator.projects[projectIndex].isTrashed = true;
        yield collaborator.save();
        res.status(200).json({ message: 'Project trashed successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.trashProject = trashProject;
// Controller function to restore a trashed project
const restoreProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { projectId } = req.body;
    try {
        // Validating project ID
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
        // Finding the collaborator
        const collaborator = yield userModels_1.User.findById(userId);
        if (!collaborator) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        // Finding the project
        const project = yield projectModels_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        // Checking if the user is a collaborator in this project
        const collaborators = project.collaborators.filter(collaborator => collaborator.member._id.toString() === userId);
        if (collaborators.length < 0) {
            return res.status(400).json({
                error: 'This user is not a collaborator in this project'
            });
        }
        // Updating the project's trashed status
        const projectIndex = collaborator.projects.findIndex(project => project.project.toString() === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({
                error: "Project not found in the user's project list"
            });
        }
        collaborator.projects[projectIndex].isTrashed = false;
        yield collaborator.save();
        res.status(200).json({ message: 'Project restored successfully' });
    }
    catch (error) {
        console.error('Error restoring project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.restoreProject = restoreProject;
// Controller function to get projects by user ID
const getProjectByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    try {
        // Validating user ID
        if (!userId) {
            return res.status(400).json({
                error: 'User ID must be provided'
            });
        }
        const user = yield userModels_1.User.findById(userId)
            .populate({
            path: 'projects.project',
            populate: {
                path: 'subTopics',
                model: 'Topic'
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
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'ideationMethod',
                model: 'IdeationMethod'
            }
        })
            .populate({
            path: 'projects.project',
            populate: {
                path: 'coordinator',
                model: 'User'
            }
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        // Formatting project details
        const projects = user.projects.map(project => project);
        const projectStrings = projects.map(project => {
            const { title, description, visibility, collaboratorsCount, collaborators, mainTopic, subTopics, clubs, modules, events, thumbnailUrl } = project.project;
            const formattedSubTopics = subTopics === null || subTopics === void 0 ? void 0 : subTopics.map(topic => {
                return {
                    topicId: topic._id,
                    topicName: topic.topicName
                };
            });
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
            const coordinator = {
                firstName: project.project.coordinator.firstName,
                lastName: project.project.coordinator.lastName,
                email: project.project.coordinator.email,
                profilePicUrl: project.project.coordinator.profilePicUrl
            };
            const formattedProject = {
                projectId: project.project.id,
                IdeationMethod: project.project.ideationMethod.methodName,
                ProjectTitle: title,
                Description: description,
                coordinator,
                Visibility: visibility,
                CollaboratorsCount: collaboratorsCount.toString(),
                collaborators: formattedCollaborators,
                MainTopic: (mainTopic === null || mainTopic === void 0 ? void 0 : mainTopic.topicName) || '',
                MainTopicId: mainTopic === null || mainTopic === void 0 ? void 0 : mainTopic.id,
                SubTopics: formattedSubTopics,
                Clubs: clubs.map(club => club.clubName),
                Modules: modules.map(module => module.moduleName),
                Events: events.map(event => event.eventName),
                ThumbnailUrl: thumbnailUrl,
                isTrashed: project.isTrashed,
                isFav: project.isFav,
                joinedDate: project.joinedAt,
                projectStatus: project.project.status,
                timer: project.project.timer,
                ProjectStatus: project.project.status
            };
            return formattedProject;
        });
        res.status(200).json(projectStrings);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getProjectByUserId = getProjectByUserId;
const deleteProjectManyIdeas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { ideaIds } = req.body;
        if (!ideaIds || !Array.isArray(ideaIds)) {
            return res
                .status(400)
                .json({
                error: 'Invalid input. Idea IDs must be provided in an array.'
            });
        }
        // Fetch the project document
        const project = yield projectModels_1.Project.findById(projectId).populate('ideas');
        if (!project) {
            console.error('Project not found');
            return; // Exit the function if project is not found
        }
        const filteredIdeas = project.ideas.filter(idea => !ideaIds.includes(idea.id));
        const ideaObjectIds = ideaIds.map(id => new mongoose_1.default.Types.ObjectId(id));
        project.ideas = filteredIdeas;
        yield project.save();
        yield ideaModels_1.Idea.deleteMany({ _id: { $in: ideaObjectIds } });
        res.status(200).json({ message: 'Ideas deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting ideas:', error);
        res.status(500).json({ error: 'An error occurred while deleting ideas.' });
    }
});
exports.deleteProjectManyIdeas = deleteProjectManyIdeas;
