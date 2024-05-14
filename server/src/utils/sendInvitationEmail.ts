import transporter from '../config/ndmailer'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Interface representing the structure of an email.
 */
interface EmailInterface {
  from: string
  to: string
  subject: string
  html: string
}

/**
 * Payload structure for invitation links.
 */
export interface LinkPayload extends JwtPayload {
  userId: string
  email: string
  projectId: string
  invitationId: string
  exp?: number
}

/**
 * Sends an invitation email to a user.
 * @param coordinator The name of the coordinator sending the invitation.
 * @param userId The ID of the user being invited.
 * @param email The email address of the user being invited.
 * @param projectId The ID of the project to which the user is being invited.
 * @param projectName The name of the project.
 * @param invitationId The ID of the invitation.
 */
const sendInvitationEMail = async (
  coordinator: string,
  userId: string,
  email: string,
  projectId: string,
  projectName: string,
  invitationId: string
) => {
  const linkPayload: LinkPayload = {
    userId,
    email,
    projectId,
    invitationId
  }
  const link_token = jwt.sign(
    linkPayload,
    process.env.JWT_SECRET_EMAIL as string,
    {
      expiresIn: '3d'
    }
  )
  const invitationLink: string = `http://${process.env.HOST}:${process.env.PORT}/invitation/accept?token=${link_token}`

  const message: EmailInterface = {
    from: process.env.AUTH_EMAIL as string,
    to: email,
    subject: `You are invited to join this project <<${projectName}>>`,
    html: `<p> ${coordinator} has shared the project ${projectName} with you:</p>
        <form action="${invitationLink}" method="post">
            <button type="submit">Accept Invitation</button>
        </form>`
  }
  try {
    await transporter.sendMail(message)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export default sendInvitationEMail