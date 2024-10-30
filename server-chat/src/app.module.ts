// app.module.ts
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-local';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    //TypeOrmModule.forRoot(dataSourceOptions),
    PrismaModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
