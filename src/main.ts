import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as useragent from 'express-useragent';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
