import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt } from "sequelize-typescript";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'levels'
})
class Level extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @Column
  name: string

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Level;