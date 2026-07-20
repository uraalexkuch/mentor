import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AdminLoginDto, CreateAdminDto } from './dto/auth.dto';
import { AdminRole } from './enums/admin-role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизація адміністратора' })
  @ApiResponse({ status: 200, description: 'Токен успішно повернуто' })
  @ApiResponse({ status: 401, description: 'Невірні об\'єднання' })
  async login(@Body() dto: AdminLoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати профіль поточного адміністратора' })
  @ApiResponse({ status: 200, description: 'Профіль успішно повернуто' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити нового адміністратора (тільки SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Адміністратора успішно створено' })
  async createAdmin(@Body() dto: CreateAdminDto, @Req() req: any) {
    return this.authService.createAdmin(dto, req.user.id);
  }

  @Get('admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати список всіх адміністраторів' })
  @ApiResponse({ status: 200, description: 'Список адмінів повернуто' })
  async getAllAdmins(@Req() req: any) {
    return this.authService.getAllAdmins(req.user.id);
  }

  @Post('admins/:id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Деактивувати/активувати адміністратора' })
  @ApiResponse({ status: 200, description: 'Статус успішно оновлено' })
  async toggleAdminStatus(@Req() req: any, @Body('id') adminId: string) {
    return this.authService.toggleAdminStatus(adminId, req.user.id);
  }
}
