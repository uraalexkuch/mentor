import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'mentorship_pairs', timestamps: true })
export class MentorshipPair extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(36), allowNull: false })
  declare mentorId: string;

  @Column({ type: DataType.STRING(36), allowNull: false })
  declare menteeId: string;

  @Column({
    type: DataType.ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED'),
    defaultValue: 'PLANNING',
  })
  declare status: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true })
  declare updatedAt: Date;
}
