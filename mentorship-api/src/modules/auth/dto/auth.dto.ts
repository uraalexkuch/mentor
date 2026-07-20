import { IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO для авторизації адміністратора
 */
export class AdminLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email є обов\'язковим' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Пароль повинен бути не менше 6 символів' })
  password!: string;
}

/**
 * DTO для відповіді з токеном
 */
export class LoginResponseDto {
  access_token!: string;
  user!: {
    id: string;
    email: string;
    role: string;
    name?: string;
    regionId?: string | null;
  };
}

/**
 * DTO для створення нового адміністратора
 */
export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  regionId?: string;
}
