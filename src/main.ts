import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { fail } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      return new BadRequestException(fail(errors.flatMap(e => Object.values(e.constraints))))
    }
  }));

  await app.listen(process.env.APP_PORT);

  Logger.log(`Listening on ${await app.getUrl()}`)
}
bootstrap();
