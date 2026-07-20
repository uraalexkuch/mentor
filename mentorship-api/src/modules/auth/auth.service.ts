import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../../models/admin-user.model';
import { AdminLoginDto, CreateAdminDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const adminCount = await AdminUser.count();
      this.logger.log(`📊 Кількість адмінів у БД: ${adminCount}`);

      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await AdminUser.create({
          email: 'admin@dcz.gov.ua',
          password: hashedPassword,
          name: 'Super Admin',
          role: 'SUPER_ADMIN' as any,
          isActive: true,
        });
        this.logger.log('✅ Дефолтного адміністратора створено');
      }
    } catch (error) {
      this.logger.error('❌ Помилка при створенні адміністратора:', error);
    }
  }

  async login(dto: AdminLoginDto) {
    const user = await AdminUser.findOne({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Невірний email, пароль, або акаунт деактивовано');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    await user.update({ lastLoginAt: new Date() });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      regionId: (user as any).regionId ?? null,
    };
    
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: (user as any).name,
        regionId: (user as any).regionId ?? null,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await AdminUser.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) throw new UnauthorizedException('Адміністратора не знайдено');
    return user;
  }

  async createAdmin(dto: CreateAdminDto, createdBy: string) {
    const creator = await AdminUser.findByPk(createdBy);
    
    if (!creator || (creator as any).role !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Доступ заборонено');
    }

    const existing = await AdminUser.findOne({ where: { email: dto.email } });
    if (existing) throw new UnauthorizedException('Адміністратор з таким email вже існує');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const newAdmin = await AdminUser.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name || 'Новий адміністратор',
      role: (dto.regionId ? 'REGIONAL_MODERATOR' : 'SUPER_ADMIN') as any,
      regionId: dto.regionId ?? null,
      isActive: true,
    });

    const payload = { sub: newAdmin.id, email: newAdmin.email, role: newAdmin.role, regionId: (newAdmin as any).regionId ?? null };

    return {
      access_token: this.jwtService.sign(payload),
      user: { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role, name: (newAdmin as any).name, regionId: (newAdmin as any).regionId ?? null },
    };
  }

  async getAllAdmins(creatorId: string) {
    const creator = await AdminUser.findByPk(creatorId);
    if (!creator || (creator as any).role !== 'SUPER_ADMIN') throw new UnauthorizedException('Доступ заборонено');
    return await AdminUser.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
  }

  async toggleAdminStatus(adminId: string, creatorId: string) {
    const creator = await AdminUser.findByPk(creatorId);
    if (!creator || (creator as any).role !== 'SUPER_ADMIN') throw new UnauthorizedException('Доступ заборонено');

    const admin = await AdminUser.findByPk(adminId);
    if (!admin) throw new UnauthorizedException('Адміністратора не знайдено');
    if (admin.id === creatorId) throw new UnauthorizedException('Неможливо деактивувати власний акаунт');

    await admin.update({ isActive: !(admin as any).isActive });
    return { ...(admin as any).toJSON(), password: undefined };
  }
}
