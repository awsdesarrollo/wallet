import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Constants, Hash } from "src/utils";
import { Level } from ".";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users'
})

class User extends Model {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number

  @ForeignKey(() => Level)
  @Column
  level_id: number

  @BelongsTo(() => Level)
  level?: Level

  @Column
  email: string

  @Column
  username: string

  @Column
  get password(): string {
    return this.getDataValue('password');
  }
  set password(value: string) {
    const hash = Hash.makeSync(value);
    this.setDataValue('password', hash);
  }

  @Column
  name: string

  @Column
  last_name: string

  @Column(DataType.VIRTUAL)
  get fullName(): string {
    return `${this.getDataValue('name') || ''} ${this.getDataValue('last_name') || ''}`.trim();
  }

  @Column
  phone?: string

  @Column
  balance: number

  @Column
  balance_date?: string

  @Column
  performance: number

  @Column
  photo?: string

  @Column
  notification_config: string

  @Column
  verified: number

  @Column
  status: number

  @Column(DataType.VIRTUAL)
  get status_text(): string {
    switch (this.getDataValue('status')) {
      case Constants.USER.STATUS.PENDING:
        return 'Pendiente';

      case Constants.USER.STATUS.ACTIVE:
        return 'Activo';

      case Constants.USER.STATUS.INACTIVE:
        return 'Desactivado';

      default: return 'No definido';
    }
  }

  @Column
  delete_ios: Date

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @DeletedAt
  deleted_at: Date
}

export default User;