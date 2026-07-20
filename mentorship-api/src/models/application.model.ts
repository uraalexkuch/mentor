import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'mentorship_applications', timestamps: true })
export class Application extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  // === Особисті дані ===
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare birthDate: Date;

  @Column({ type: DataType.STRING(10), allowNull: true })
  declare passportSeries: string;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare passportNumber: string;

  @Column({ type: DataType.STRING(20), unique: true, allowNull: true })
  declare rnokpp: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare rnokppRefusalNote: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare email: string;

  @Column({ type: DataType.STRING(10), allowNull: false })
  declare regionCode: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare employmentCenterId: string;

  // === Інформація про бізнес ===
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isBusinessActive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare receivedMicrogrant: boolean;

  @Column({ type: DataType.STRING(10), allowNull: true })
  declare micrograntYear: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare primaryBusinessActivity: string;

  // === Пільгові категорії ===
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare applicantCategories: string[];

  // === Дані ветерана (для членів сім'ї) ===
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare veteranFullName: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare veteranRnokpp: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare veteranContactInfo: string;

  // === Потреби (чекбокси) ===
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare needsTraining: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare needsMentorshipSupport: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare needsPracticalHelp: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare needsMicrograntMentorship: boolean;

  // === Статус та метадані ===
  @Column({
    type: DataType.ENUM('подано', 'опрацьовується', 'підтверджено', 'резерв', 'відмовлено', 'завершено навчання', 'дата консультації'),
    defaultValue: 'подано',
  })
  declare status: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare certificateNumber: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
