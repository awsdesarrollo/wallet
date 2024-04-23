import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'config'
})
class Config extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @Column
  app_android_version: string

  @Column
  app_ios_version: string

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Config;