import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateUserRequestDto,
  GetUsersQueryDto,
  UserResponseDto,
  UsersPageResponseDto,
} from './dto/user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create User
  async createUser(data: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          username: data.username,
          name: data.fullName,
          auth: {
            create: {
              username: data.username,
              password: data.password, // Lưu ý: Cần hash password trước khi lưu
              roleId: data.roleId || 2, // Sử dụng roleId từ input hoặc mặc định là 2
            },
          },
        },
        include: {
          auth: {
            select: { roleId: true },
          },
        },
      });

      return new UserResponseDto({
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        roleId: newUser.auth.roleId,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Username already exists');
        }
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // Get List Users
  async getListUsers(query: GetUsersQueryDto): Promise<UsersPageResponseDto> {
    const { page = 1, limit = 10, search, roleId } = query;
    const skip = (page - 1) * limit;

    try {
      const whereCondition: Prisma.UserWhereInput = {
        OR: search
          ? [
              { username: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
        auth: roleId ? { roleId } : undefined,
      };

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { auth: { select: { roleId: true } } },
        }),
        this.prisma.user.count({ where: whereCondition }),
      ]);

      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }

      const data = users.map(
        (user) =>
          new UserResponseDto({
            id: user.id,
            username: user.username,
            fullName: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roleId: user.auth.roleId,
          }),
      );

      return new UsersPageResponseDto({ data, total, page, limit });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving user list');
    }
  }
}
