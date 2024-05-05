import { Request, Response } from 'express'
import { LinkPayload } from '../../utils/sendInvitationEmail'
import jwt, { verify, JwtPayload } from 'jsonwebtoken'
import { Invitation } from './invitationModel'
import { Project } from '../project/projectModels'
import { User } from '../user/userModels'

const acceptInvitation = async (req: Request, res: Response) => {
  const invitationToken: string = req.query.token as string
  try {
    if (!invitationToken) {
      return res.status(403).json({
        error: 'Invalid invitation url'
      })
    }
    const invitationPayload = verify(
      invitationToken,
      process.env.JWT_SECRET_EMAIL as string
    )
    const { userId, projectId, invitationId } = invitationPayload as LinkPayload

    const invitation = await Invitation.findById(invitationId)

    if (invitation?.accepted || !invitation) {
      return res.status(404).json({
        error: 'Invitation has been accepted'
      })
    }
    if (invitation.expiresAt.getTime() <= Date.now()) {
      return res.status(403).json({
        error: 'Invitation has expired'
      })
    }
    invitation.accepted = true
    invitation.save()

    const user = await User.findById(userId)
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
      if (!updatedProject) {
        return res.status(404).json({
          error: 'Error updating the project or the project does not exist'
        })
      }
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.json(404).json({
        error: 'Project not found'
      })
    }
    user?.projects.push({
      project: project,
      joinedAt: new Date(),
      isTrashed: false
    })
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

export { acceptInvitation }
