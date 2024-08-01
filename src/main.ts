import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import helmet from 'helmet';
import 'dotenv/config';

let server: Handler;

console.log(process.env.NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });

  app.use(helmet());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({
    app: expressApp,
  });
}

export const handler: Handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  console.log(`Bootstrap started...`);
  if (!server) {
    server = await bootstrap();
  }
  console.log(`Bootstrap finished!`);
  console.log(`Event: ${JSON.stringify(event)}`);
  return server(event, context, callback);
};

async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });

  app.use(helmet());
  await app.listen(3000);
}

if (process.env.NODE_ENV === 'development') {
  bootstrapLocal();
}
