import { Injectable } from '@nestjs/common';
import { Entry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {}

  async createNew(data: Prisma.EntryCreateInput): Promise<Entry> {
    return this.prisma.entry.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }


  async create(data: { content: string; userId: number }): Promise<Entry> {
    const { content, userId } = data;
    const translation = await this.translate(content);
    return this.prisma.entry.create({
      data: {
        content: content,
        russianContent: translation,
        userId: userId,
        date: new Date(),
        createdAt: new Date(),
      },
    });
    
  }

async translate(englishWord: string): Promise<string | null> {
    try {
      const url = 'https://translate.api.cloud.yandex.net/translate/v2/translate';
      const folderId = 'b1g2vgpcupkp45viq5r4';
      const targetLanguage = 'ru';
      const body = {
        folderId,
        texts: [englishWord],
        targetLanguageCode: targetLanguage,
      };
      const apiKey = process.env.YANDEX_TOKEN;
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const translation = response.data.translations[0].text;
      return translation;
    } catch (error) {
      return null;
    }
  }
  
  async findAllByUser(userId: number): Promise<Entry[]> {
    return this.prisma.entry.findMany({
      where: {
        userId,
      },
    });
  }

  async findAllByUserAndDate(userId: number, date: Date): Promise<Entry[]> {
    const entries = await this.prisma.entry.findMany({
      where: {
        userId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });
    return entries.filter((entry) => entry.date.toDateString() === date.toDateString());
  }
}