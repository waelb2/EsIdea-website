import transporter from '../config/ndmailer'
import jwt, { JwtPayload, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface EmailInterface {
  from: string
  to: string
  subject: string
  html: string
}

export interface LinkPayload extends JwtPayload {
  userId: string
  email: string
  projectId: string
  invitationId: string
  exp?: number
}

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
  const invitationLink: string = ` http://localhost:3000/invitation/accept?token=${link_token}`

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
