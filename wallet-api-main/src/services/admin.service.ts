import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from "@nestjs/sequelize";
import { User, Token } from 'src/models';

@Injectable()
export class AdminService {

    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Token) private tokenModel: typeof Token,
    ) { }

    // @Cron(CronExpression.EVERY_12_HOURS)
    // async scheduled_push() {
        
    // }
}