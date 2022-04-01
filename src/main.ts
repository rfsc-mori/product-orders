import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('app.port');

  Logger.log(`Listening on port: ${port}`, "Bootstrap");

  await app.listen(port);
}

bootstrap();
