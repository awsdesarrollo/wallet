export class UserIdDTO {
    user_id: number
}
export class UpdatedUserDTO {
    user_id: number
}
export class ApprovedOrderDto {
    user_id: number
    order_id: number
}
export class RejectedOrderDto extends ApprovedOrderDto {}