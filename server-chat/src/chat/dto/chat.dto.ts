// dto/chat.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({
    example: 'My Chat Room',
    description: 'The name of the chat room',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: ['user1', 'user2'],
    description: 'Array of participant usernames',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalParticipantUsernames?: string[];
}

export class ChatRoomResponseDto {
  @IsUUID('4')
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsArray()
  @ApiProperty()
  participants: UserResponseDto[];
}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  // @IsNotEmpty()
  // @IsUUID('4')
  // @ApiProperty()
  // senderId: string;

  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty()
  chatRoomId: string;
}

export class MessageResponseDto {
  @IsUUID('4')
  id: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsUUID('4')
  @ApiProperty()
  senderId: string;

  @IsUUID('4')
  @ApiProperty()
  chatRoomId: string;

  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @IsDate()
  @ApiProperty()
  updatedAt: Date;

  @IsArray()
  @ApiProperty()
  readBy: ReadMessageResponseDto[];
}

export class UserResponseDto {
  @IsUUID('4')
  id: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  name: string;
}

export class ReadMessageResponseDto {
  @IsUUID('4')
  id: string;

  @IsUUID('4')
  userId: string;

  @IsUUID('4')
  messageId: string;

  @IsDate()
  readAt: Date;
}

export class GetMessagesQueryDto {
  @IsNotEmpty()
  @IsUUID('4')
  chatRoomId: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;
}

export class MessagesPageResponseDto {
  @IsArray()
  @Type(() => MessageResponseDto)
  data: MessageResponseDto[];

  @Type(() => Number)
  total: number;

  @Type(() => Number)
  page: number;

  @Type(() => Number)
  limit: number;
}
