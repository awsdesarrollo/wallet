import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models';

@Injectable()
export class AuthGuardService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async getProfile(userId: number): Promise<User> {
    try {
      return await this.userModel.findByPk(userId);

    } catch (error) {
      throw error;
    }
  }
}
