import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as moment from 'moment';
import { ValidationPipe, ValidationError, UnprocessableEntityException } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils';
import firebase from "firebase-admin";
const serviceAccount = require("./resources/firebase.json");

Date.prototype.toJSON = function () {
  return moment(this).format('YYYY-MM-DD HH:mm:ss');
}

async function bootstrap() {

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  });

  let httpsOptions = {}
  let app = await NestFactory.create(AppModule, { cors: true });

  if (process.env.ENV == 'production') {
    const privateKey = fs.readFileSync(process.env.KEY_FILE, 'utf8');
    const certificate = fs.readFileSync(process.env.CERT_FILE, 'utf8');
    httpsOptions = {key: privateKey, cert: certificate};
    app = await NestFactory.create(AppModule,{
      cors: true,
      httpsOptions
    });
  }

  const config = new DocumentBuilder()
    .setTitle(process.env.REACT_APP_NAME)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {
      return new UnprocessableEntityException({
        error: Object.values(errors[0].constraints)[0]
      });
    }
  }));
  app.useGlobalFilters(HttpExceptionFilter);
  await app.listen(process.env.PORT);
  // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}
bootstrap();
