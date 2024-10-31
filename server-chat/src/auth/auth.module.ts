// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomJwtService } from './jwt.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    //TypeOrmModule.forFeature([Auth, Role]),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomJwtService],
})
export class AuthModule {}
