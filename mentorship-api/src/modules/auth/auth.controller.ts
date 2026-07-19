import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'Авторизація користувача' })
  @ApiResponse({ status: 200, description: 'Токен успішно повернуто' })
  async login(@Body() data: { email: string; password: string }): Promise<{ access_token: string }> {
    // TODO: Реалізувати логіку авторизації з базою даних
    return { access_token: 'mock-jwt-token' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувача успішно зареєстровано' })
  async register(@Body() data: { email: string; password: string }): Promise<{ id: string }> {
    // TODO: Реалізувати логіку реєстрації з базою даних
    return { id: '1' };
  }
}
