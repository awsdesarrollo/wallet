import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Currency from './currency';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'conversions'
})
class Conversion extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => Currency)
  @Column
  currency_id: number

  @BelongsTo(() => Currency)
  currency?: Currency

  @Column
  amount: number

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Conversion;