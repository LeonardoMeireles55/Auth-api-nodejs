import { IsNotEmpty, IsEmail } from "class-validator";

export default class signinDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
  }