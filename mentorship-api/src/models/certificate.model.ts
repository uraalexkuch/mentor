import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'certificate_registry', timestamps: true })
export class Certificate extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  declare year: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare institutionName: string;

  @Column({ type: DataType.STRING(15), allowNull: false })
  declare edrpoUCode: string;

  @Column({ type: DataType.STRING(20), unique: true, allowNull: false })
  declare certificateNumber: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare participantFullName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare programName: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare issueDate: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;
}
