import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'mentors', timestamps: true })
export class Mentor extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare specialization: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare experienceYears: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare rating: number;

  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  declare maxActiveMentees: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isAvailable: boolean;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare organizationType: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isVolunteer: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
