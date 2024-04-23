import { Column, Model, Table, CreatedAt, UpdatedAt, DeletedAt } from "sequelize-typescript";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'tokens'
})

class Token extends Model {
    @Column
    token: string

    @Column
    user_id: number

    @CreatedAt
    @Column
    created_at: Date

    @UpdatedAt
    @Column
    updated_at: Date

    @DeletedAt
    @Column
    deleted_at: Date
}

export default Token;