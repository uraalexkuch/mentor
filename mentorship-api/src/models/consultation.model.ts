import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'consultation_orders', timestamps: true })
export class Consultation extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  // === Особисті дані ===
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare birthDate: Date;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare email: string;

  @Column({ type: DataType.STRING(10), allowNull: false })
  declare regionCode: string;

  // === Інформація про бізнес ===
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isBusinessActive: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare businessInactiveReason: string;

  // === Теми консультації (чекбокси) ===
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare topicGovernmentPrograms: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare topicGrantSelection: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare topicMentorshipSupport: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare topicOther: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare topicStateCompensations: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare otherTopicDescription: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare consultationResult: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare consultantName: string;

  // === Бажана дата консультації ===
  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare preferredDate: Date;

  // === Статус ===
  @Column({
    type: DataType.ENUM('подано', 'опрацьовується', 'підтверджено', 'резерв', 'відмовлено', 'завершено навчання', 'дата консультації'),
    defaultValue: 'подано',
  })
  declare status: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
