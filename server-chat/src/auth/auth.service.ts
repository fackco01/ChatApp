import { CustomJwtService, TokenPayload } from './jwt.service';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(CustomJwtService)
    private readonly jwtService: CustomJwtService,
  ) {}

  //Register
  async register(registerData: RegisterDto) {
    const existingAuth = await this.prisma.auth.findFirst({
      where: {
        username: registerData.username,
      },
    });

    if (existingAuth) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.jwtService.hashPassword(
      registerData.password,
    );

    try {
      // Sử dụng transaction để đảm bảo tính nhất quán của dữ liệu
      return await this.prisma.$transaction(async (prisma) => {
        // Tạo auth record trước
        const auth = await prisma.auth.create({
          data: {
            username: registerData.username,
            password: hashedPassword,
            roleId: 2, // Role mặc định là User
          },
        });

        // Tạo user record với cùng id
        const user = await prisma.user.create({
          data: {
            id: auth.id,
            username: registerData.username,
            name: registerData.name,
          },
        });

        return {
          id: auth.id,
          username: auth.username,
          name: auth.username,
          roleId: auth.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while registering user' + error.message,
      );
    }
  }

  //Login
  async login(
    loginData: LoginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const existingAuth = await this.prisma.auth.findFirst({
      where: {
        username: loginData.username,
      },
    });

    if (!existingAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.jwtService.isPasswordValid(
      loginData.password,
      existingAuth.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = {
      sub: existingAuth.id,
      username: existingAuth.username,
      roleId: existingAuth.roleId,
    };

    const { accessToken, refreshToken } =
      await this.jwtService.generateToken(payload);

    return { token: accessToken, refreshToken };
  }

  //Refresh Token
  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshTokens(refreshToken);
  }
}
