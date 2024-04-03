import { IsNotEmpty, Matches, IsEmail } from "class-validator";

export default class UserDTO {
  id?: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  // @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateBirth: Date;

  // @Matches(/^\d{5}-\d{3}$/)
  postalCode: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  @IsEmail()
  email: string;

  password?: string;

  enabled?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}
