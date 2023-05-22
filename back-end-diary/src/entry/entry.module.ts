import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EntryController],
  providers: [EntryService, PrismaService]
})
export class EntryModule {}
