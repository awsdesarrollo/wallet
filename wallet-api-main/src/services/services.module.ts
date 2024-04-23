import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import {
    User,
    Token
} from 'src/models';
import { AdminService } from './admin.service';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User,
            Token
        ])
    ],
    providers: [
        AdminService
    ],
})
export class ServicesModule {}
