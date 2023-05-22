import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.use(cors());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  app.setGlobalPrefix('api')
  app.enableCors()
  await app.listen(4200);
}
bootstrap();
 