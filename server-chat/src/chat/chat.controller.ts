import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {
  ChatRoomResponseDto,
  CreateChatRoomDto,
  CreateMessageDto,
  MessageResponseDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create a new chat room' })
  @ApiResponse({ status: 201, type: ChatRoomResponseDto })
  async createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.createChatRoom(createChatRoomDto);
  }

  @Get('rooms/:id')
  @ApiOperation({ summary: 'Get a chat room by ID' })
  @ApiResponse({ status: 200, type: ChatRoomResponseDto })
  @ApiBody({ type: CreateChatRoomDto })
  async getChatRoom(
    @Param('id', ParseUUIDPipe) chatRoomId: string,
  ): Promise<ChatRoomResponseDto> {
    return this.chatService.getChatRoom(chatRoomId);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all chat rooms for a user' })
  @ApiResponse({ status: 200, type: [ChatRoomResponseDto] })
  async getUsersChatRooms(@Req() req): Promise<ChatRoomResponseDto[]> {
    const user = req.user;
    const userId = user.sub;
    return this.chatService.getUserChatRooms(userId);
  }

  //Message Endpoints
  @Post('messages')
  @ApiOperation({ summary: 'Get all messages from chat' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async createMessage(
    @Body() messageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.chatService.createMessage(messageDto);
  }
}
