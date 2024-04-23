import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Constants } from "src/utils";
import { User } from ".";

@Table({
  timestamps: true,
  tableName: 'movements',
  paranoid: true
})

class Movement extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => User)
  @Column
  user_id: number

  @BelongsTo(() => User)
  user?: User

  @Column
  type_id: number

  @Column(DataType.VIRTUAL)
  get type(): string {
    switch (this.getDataValue('type_id')) {
      case Constants.ORDER.FUNDS_SOURCE.BALANCE:
        return 'Saldo inicial';
      case Constants.ORDER.FUNDS_SOURCE.PERFORMANCE:
        return 'Rendimiento';
      default:
        return 'No definido';
    }
  }

  @Column
  amount: number

  @Column
  date: string

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default Movement;