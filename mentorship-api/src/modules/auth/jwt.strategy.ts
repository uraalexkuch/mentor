import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminUser } from '../../models/admin-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'mentorship-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    this.logger.log(`🔍 JwtStrategy.validate(): Payload: ${JSON.stringify(payload)}`);
    
    const user = await AdminUser.findByPk(payload.sub);

    if (!user || !user.isActive) {
      this.logger.log('❌ JwtStrategy: Користувач не знайдений або неактивний');
      throw new UnauthorizedException('Адміністратора не знайдено або він зааблокований');
    }

    this.logger.log(`✅ JwtStrategy: Користувач валідований: ${user.email}`);
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: (user as any).name,
      regionId: (user as any).regionId ?? null,
    };
  }
}
