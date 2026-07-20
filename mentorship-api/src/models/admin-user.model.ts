import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

/**
 * Роль адміністратора менторського проєкту
 */
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  REGIONAL_MODERATOR = 'REGIONAL_MODERATOR',
}

@Table({ tableName: 'admin_users', timestamps: true })
export class AdminUser extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(AdminRole)),
    defaultValue: AdminRole.SUPER_ADMIN,
  })
  declare role: AdminRole;

  @Column({ type: DataType.STRING(36), allowNull: true })
  declare regionId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastLoginAt: Date;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
