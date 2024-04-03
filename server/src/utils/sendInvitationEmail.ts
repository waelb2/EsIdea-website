import transporter from '../config/nodemailer'
import dotenv from 'dotenv'
dotenv.config()

interface EmailInterface {
  from: string
  to: string
  subject: string
  html: string
}

const sendInvitationEMail = async (
  coordinator: string,
  userId: string,
  email: string,
  projectName: string
) => {
  const invitationLink: string = 'http://localhost/invitation'

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
