import { Request, Response } from 'express'
import { LinkPayload } from '../../utils/sendInvitationEmail'
import jwt, { verify, JwtPayload } from 'jsonwebtoken'
import { Invitation } from './invitationModel'
import { Project } from '../project/projectModels'
import { User } from '../user/userModels'

// Controller function to handle accepting invitations
const acceptInvitation = async (req: Request, res: Response) => {
  // Extract invitation token from query parameters
  const invitationToken: string = req.query.token as string
  try {
    // Check if invitation token is provided
    if (!invitationToken) {
      return res.status(403).json({
        error: 'Invalid invitation URL'
      })
    }
    
    // Verify the invitation token
    const invitationPayload = verify(
      invitationToken,
      process.env.JWT_SECRET_EMAIL as string
    )
    
    // Extract data from invitation payload
    const { userId, projectId, invitationId } = invitationPayload as LinkPayload

    // Find the invitation by ID
    const invitation = await Invitation.findById(invitationId)

    // Check if invitation is already accepted or does not exist
    if (invitation?.accepted || !invitation) {
      return res.status(404).json({
        error: 'Invitation has been accepted or does not exist'
      })
    }
    
    // Check if the invitation has expired
    if (invitation.expiresAt.getTime() <= Date.now()) {
      return res.status(403).json({
        error: 'Invitation has expired'
      })
    }
    
    // Mark the invitation as accepted
    invitation.accepted = true
    invitation.save()

    // Find the user by ID
    const user = await User.findById(userId)
    
    // Add the user to the project's collaborators
    if (user) {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $addToSet: {
            collaborators: {
              member: user,
              joinedAt: new Date()
            }
          },
          $inc: { collaboratorsCount: 1 }
        },
        { new: true }
      )
      
      // Check if the project was updated successfully
      if (!updatedProject) {
        return res.status(404).json({
          error: 'Error updating the project or the project does not exist'
        })
      }
    }

    // Find the project by ID
    const project = await Project.findById(projectId)
    
    // Check if the project exists
    if (!project) {
      return res.json(404).json({
        error: 'Project not found'
      })
    }
    
    // Add the project to the user's list of projects
    user?.projects.push({
      project: project,
      joinedAt: new Date(),
      isTrashed: false,
      isFav: false
    })
    
    // Update the user's projects
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          projects: {
            project: await Project.findById(projectId),
            joinedAt: new Date()
          }
        },
        $inc: { collaboratorsCount: 1 }
      },
      { new: true }
    )

    // Respond with success message
    res.status(201).json({
      msg: 'Invitation accepted successfully'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

// Export controller function
export { acceptInvitation }
