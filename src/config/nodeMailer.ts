import * as nodeMailer from "nodemailer";


export const sendEmail = async (option: any) => {
    const transporter: nodeMailer.Transporter = nodeMailer.createTransport({
        
        host: process.env.EMAIL_HOST,
        port:25,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.USER_PASSWORD,

        },
    });


    const emailOptions = {
        from: 'from@example.com',
        to: option.email,
        subject: option.subject,
        text: option.message,
    }
    await transporter.sendMail(emailOptions);
}