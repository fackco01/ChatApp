import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ChatRoomResponseDto,
  CreateChatRoomDto,
  CreateMessageDto,
  GetMessagesQueryDto,
  MessageResponseDto,
  MessagesPageResponseDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  //Create new chat room
  async createChatRoom(data: CreateChatRoomDto): Promise<ChatRoomResponseDto> {
    try {
      // Kiểm tra xem tất cả users có tồn tại không
      const users = await this.prisma.user.findMany({
        where: {
          username: {
            in: data.participantUsernames,
          },
        },
      });

      if (users.length !== data.participantUsernames.length) {
        throw new BadRequestException('One or more users do not exist');
      }

      // Nếu tất cả users tồn tại, tiếp tục tạo chat room

      if (
        !data.participantUsernames ||
        !Array.isArray(data.participantUsernames)
      ) {
        throw new BadRequestException(
          'participantIds must be an array of UUIDs',
        );
      }

      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          name: data.name,
          participants: {
            create: users.map((user) => ({
              user: { connect: { id: user.id } },
            })),
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      return this.transformToChatRoomResponse(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //Get Chat Room
  async getChatRoom(chatRoomId: string): Promise<ChatRoomResponseDto> {
    try {
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!chatRoom) {
        throw new InternalServerErrorException('User not found');
      }

      return this.transformToChatRoomResponse(chatRoom);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //Get User chat room
  async getUserChatRooms(userId: string): Promise<ChatRoomResponseDto[]> {
    try {
      const chatRooms = await this.prisma.chatRoom.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      return chatRooms.map((room) => this.transformToChatRoomResponse(room));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //Create Messenger
  async createMessage(data: CreateMessageDto): Promise<MessageResponseDto> {
    try {
      const participant = await this.prisma.chatRoomParticipant.findUnique({
        where: {
          userId_chatRoomId: {
            userId: data.senderId,
            chatRoomId: data.chatRoomId,
          },
        },
      });

      if (!participant) {
        throw new BadRequestException(
          'User is not a participant of this chat room',
        );
      }

      const message = await this.prisma.message.create({
        data: {
          content: data.content,
          sender: { connect: { id: data.senderId } },
          chatRoom: { connect: { id: data.chatRoomId } },
        },
        include: {
          sender: true,
          readBy: true,
        },
      });

      return this.transformToMessageResponse(message);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //Get Message
  async getMessage(
    query: GetMessagesQueryDto,
  ): Promise<MessagesPageResponseDto> {
    try {
      const { chatRoomId, page = 1, limit = 50 } = query;
      const skip = (page - 1) * limit;

      const [messages, total] = await this.prisma.$transaction([
        this.prisma.message.findMany({
          where: { chatRoomId: chatRoomId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            sender: true,
            readBy: true,
          },
        }),
        this.prisma.message.count({ where: { chatRoomId: chatRoomId } }),
      ]);

      return {
        data: messages.map((msg) => this.transformToMessageResponse(msg)),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //Mark message as read
  async markMessageAsRead(userId: string, messageId: string): Promise<void> {
    await this.prisma.readMessage.create({
      data: {
        user: { connect: { id: userId } },
        message: { connect: { id: messageId } },
      },
    });
  }

  async addUserToChatRoom(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chatRoomParticipant.create({
      data: {
        user: { connect: { id: userId } },
        chatRoom: { connect: { id: chatRoomId } },
      },
    });
  }

  async removeUserFromChatRoom(
    chatRoomId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.chatRoomParticipant.delete({
      where: {
        userId_chatRoomId: {
          userId: userId,
          chatRoomId: chatRoomId,
        },
      },
    });
  }

  private transformToChatRoomResponse(chatRoom): ChatRoomResponseDto {
    return {
      id: chatRoom.id,
      name: chatRoom.name,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
      participants: chatRoom.participants.map((participant) => ({
        id: participant.user.id,
        username: participant.user.username,
        name: participant.user.name,
      })),
    };
  }

  private transformToMessageResponse(message): MessageResponseDto {
    return {
      id: message.id,
      content: message.content,
      senderId: message.sender.id,
      chatRoomId: message.chatRoom.id,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      readBy: message.readBy.map((read) => ({
        id: read.id,
        userId: read.user.id,
        messageId: read.message.id,
        readAt: read.readAt,
      })),
    };
  }
}
