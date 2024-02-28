export default class userDTO {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    dateBirth: Date;
    postalCode: string;
    state: string;
    city: string;
    street: string;
    email: string;
    password?: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }