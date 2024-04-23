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
    const { userId, exp, projectId, invitationId } =
      invitationPayload as LinkPayload

    if ((exp as number) > Date.now()) {
      return res.status(403).json({
        error: 'Invitation has expired'
      })
    }
    const invitation = await Invitation.findByIdAndUpdate(invitationId, {
      accepted: true
    })
    if (!invitation) {
      return res.status(404).json({
        error: 'Invitation has been accepted'
      })
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: { collaborators: await User.findById(userId) },
        $inc: { collaboratorsCount: 1 }
      },
      { new: true }
    )

    if (!updatedProject) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

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
