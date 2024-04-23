import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { SocketController } from './utils/socket/socket.controller';
import { SocketModule } from './utils/socket/socket.module';
import { PDFModule } from '@t00nday/nestjs-pdf';
const SequelizeConfig = require('./config');
import { MAIL_CONFIG } from './utils/mailer';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';

// Modulo
import { AuthModule } from './controllers/auth/auth.module';
import { AuthGuardModule } from './controllers/auth/guard/auth.module';
import { FirebaseModule } from './controllers/firebase/firebase.module';
import { ServicesModule } from './services/services.module';

// Models
import * as Models from './models';
import { ConfigModule as ConfigsModule } from './controllers/config/config.module';
import { AdminModule } from './controllers/app/admin/admin.module';
import { ClientModule } from './controllers/app/client/client.module';
import { GeneralModule } from './controllers/general/general.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      ...SequelizeConfig,
      models: [
        Models.Config,
        Models.Conversion,
        Models.Currency,
        Models.FundsSource,
        Models.Level,
        Models.Movement,
        Models.Order,
        Models.PasswordReset,
        Models.PaymentMethod,
        Models.Token,
        Models.User,
      ]
    }),
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        expiresIn: '1 days',
      }
    }),
    MailerModule.forRoot(MAIL_CONFIG),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PDFModule.register({
      isGlobal: true,
      view: {
        root: path.join(__dirname, 'resources/templates'),
        engine: 'handlebars',
        extension: 'hbs',
      },
    }),
    AuthModule,
    AuthGuardModule,
    FirebaseModule,
    SocketModule,

    ScheduleModule.forRoot(),
    AdminModule,
    ClientModule,
    ConfigsModule,
    GeneralModule,
  ],
  providers: [
    SocketController
  ],
  controllers: []
})
export class AppModule { }
