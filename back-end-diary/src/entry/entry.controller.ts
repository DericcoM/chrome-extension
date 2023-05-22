import { Controller, Post, Body, Get, Req, Query } from '@nestjs/common';
import { Entry  } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { EntryService } from './entry.service';

@Controller('entry')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Post('add')
async create(@Body() data: { content: string; userId: number }): Promise<Entry> {
  const { content, userId } = data;
  return this.entryService.create({
    content,
    userId,
  });
}

  @Get('data')
  @Auth()
  async getAllEntries(@Req() req) {
    const userId = req.user.id;
    return this.entryService.findAllByUser(userId);
  }

  @Get('date-entries')
  @Auth()
  async getDateEntries(
    @Req() req,
    @Query('date') dateString: string
    ) {
      const userId = req.user.id;
      const date = new Date(dateString);

    return this.entryService.findAllByUserAndDate(userId, date);
  }
}
