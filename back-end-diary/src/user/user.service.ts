import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async byId(id: number) {
        const user = await this.prisma.user.findUnique({where: {
        id
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
        
        })

        if(!user) {
            throw new Error('User not found')
        }

        return user
    }
}
