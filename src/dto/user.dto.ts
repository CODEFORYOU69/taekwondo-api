import { Role } from '@prisma/client';

export class CreateUserDto {
  email!: string;
  password!: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  language?: string;
  organizationId?: string;
}

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  role?: Role;
  organizationId?: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}
