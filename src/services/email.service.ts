import * as nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'halc_10@gmail.com',
                pass: '121295Leo@@'
            }
        });
    }

    public sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: 'halc_10@gmail.com',
            to,
            subject,
            text: body
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
