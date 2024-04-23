import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { FundsSource, PaymentMethod, User } from ".";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'orders'
})
class Order extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => User)
  @Column
  user_id: number

  @BelongsTo(() => User)
  user?: User

  @ForeignKey(() => FundsSource)
  @Column
  funds_source_id: number

  @BelongsTo(() => FundsSource)
  funds_source?: FundsSource

  @ForeignKey(() => PaymentMethod)
  @Column
  payment_method_id: number

  @BelongsTo(() => PaymentMethod)
  payment_method?: PaymentMethod

  @Column
  amount: number

  @Column({ defaultValue: 0 })
  amount_commission: number

  @Column
  wallet?: string

  @Column
  reference: string

  @Column
  status: number

  @Column(DataType.VIRTUAL)
  get status_text(): string {
    switch (this.getDataValue('status')) {
      case 0: return 'Pendiente';
      case 1: return 'Aprobado';
      case 2: return 'Rechazado';
      default: return 'No definido';
    }
  }

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Order;