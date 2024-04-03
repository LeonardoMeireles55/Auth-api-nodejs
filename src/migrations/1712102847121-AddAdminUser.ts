import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUser1712102847121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO public.users
    (username, firstname, lastname, "dateBirth", "postalCode", state, city, street, email, "password", "role", enabled, "createdAt", "updatedAt")
    VALUES
    ('Admin', 'Admin', 'Admin', '1995-12-12 00:00:00.000', '60411-086', 'Estado', 'Cidade', 'Rua Exemplo, 123', 'admin@email.com', '$2b$12$FJ5fq6wLgULMKoSdF0MG3O31quVphkuE4AVbY7XrxFXdvlTsLNnaa', 'admin', true, NOW(), NOW());
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
