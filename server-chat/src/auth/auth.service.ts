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
        username: registerData.username
      }
    });

    if (existingAuth) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.jwtService.hashPassword(registerData.password);

    try {
      return await this.prisma.auth.create({
        data: {
          ...registerData,
          password: hashedPassword,
          roleId: 2
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error while registering user' + error.message);
    }
  }

  //Login
  async login(loginData: LoginDto): Promise<{ token: string, refreshToken: string }> {
    const existingAuth = await this.prisma.auth.findFirst({
      where: {
        username: loginData.username
      }
    });

    if (!existingAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.jwtService.isPasswordValid(
      loginData.password,
      existingAuth.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = {
      sub: existingAuth.id,
      username: existingAuth.username,
      roleId: existingAuth.roleId,
    }

    const { accessToken, refreshToken } = await this.jwtService.generateToken(payload);

    return { token: accessToken, refreshToken };
  }


  //Refresh Token
  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshTokens(refreshToken);
  }
}
