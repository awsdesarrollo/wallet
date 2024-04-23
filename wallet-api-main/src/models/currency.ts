import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'currencies'
})
class Currency extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @Column
  name: string

  @Column
  name_plural: string

  @Column
  symbol: string

  @Column
  is_local: boolean

  @Column
  order: number

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Currency;