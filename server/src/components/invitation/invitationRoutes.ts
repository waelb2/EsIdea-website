// Importing the express module
import express from 'express';

// Importing the acceptInvitation function from invitationControllers module
import { acceptInvitation } from './invitationControllers';

// Creating an instance of express router
const router = express.Router();

// Defining a route for handling POST requests to '/accept' endpoint, using the acceptInvitation controller function
router.post('/accept', acceptInvitation);

// Exporting the router to make it available for other modules
export default router;
