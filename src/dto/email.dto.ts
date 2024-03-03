import { IsNotEmpty } from "class-validator";

export default class createEmailDTO {
    @IsNotEmpty()
    to: string;
    @IsNotEmpty()
    subject: string;
    @IsNotEmpty()
    body: string;
}