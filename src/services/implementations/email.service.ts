import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
import IEmailService from '../interfaces/Iemail.service';

dotenv.config();

const { EMAIL_USER, EMAIL_PASS } =
  process.env;

export default class EmailSender implements IEmailService {

    public transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
      

    public async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            to,
            subject,
            text :body,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw error;
        }
    };
}
