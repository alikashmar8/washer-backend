import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as useragent from 'express-useragent';
import * as firebaseAdmin from 'firebase-admin';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.use(
    morgan('common', {
      skip: function (req, res) {
        return req.method == 'OPTIONS';
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.use(useragent.express());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Washer API')
    .setDescription('The Washer API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Set firebase config options
  const firebaseConfig: firebaseAdmin.ServiceAccount = {
    projectId: configService.get<string>('firebase.projectId'),
    privateKey: configService.get<string>('firebase.privateKey'),
    clientEmail: configService.get<string>('firebase.clientEmail'),
  };

  // Initialize the firebase admin app
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig),
  });

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
