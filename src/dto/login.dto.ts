import { IsNotEmpty, IsEmail } from "class-validator";

export default class loginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
  }