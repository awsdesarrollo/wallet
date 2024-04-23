import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: 'password_resets',
  paranoid: true
})

class PasswordReset extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @Column
  user_id: number

  @Column
  code: string

  @Column
  status: number

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default PasswordReset;