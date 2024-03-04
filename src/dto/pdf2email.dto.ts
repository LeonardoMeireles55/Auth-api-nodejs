import { IsNotEmpty } from "class-validator";

type emailAttachments = {
    attachments: {
      filename: string,
      path: string,
      contentType: string
    }
  }

export default class pdf2emailDTO {
    @IsNotEmpty()
    to: string;
    @IsNotEmpty()
    subject: string;
    @IsNotEmpty()
    body: string;
    @IsNotEmpty()
    emailAttachment: emailAttachments;
}