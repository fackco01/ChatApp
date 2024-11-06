import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Auth } from './auth.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomJwtService {
  private readonly logger = new Logger(CustomJwtService.name); // Tạo instance Logger trực tiếp
  private readonly jwtSecret: string;

  constructor(
    private readonly jwt: NestJwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  //Decode token
  public async decode(token: string): Promise<Auth> {
    return await this.jwt.decode(token, null);
  }

  //Generate Token
  public async generateToken(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: '15m',
      }),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  //vertify token
  public async verifyToken(token: string): Promise<Auth> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.jwtSecret,
      });
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
  //Validate user password
  async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, userPassword);
    } catch (e) {
      this.logger.error(`Token verification failed: ${e}`);
      throw new UnauthorizedException('Invalid password');
    }
  }
  //validate user
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async validateUser(decoded: any) {
    try {
      return await this.prisma.auth.findUnique({
        where: {
          id: decoded.id,
        },
      });
    } catch (e) {
      this.logger.error(`Token verification failed: ${e}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  //hash password
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (e) {
      this.logger.error(`Token verification failed: ${e}`);
      throw new UnauthorizedException('Invalid password');
    }
  }

  public async generateRefreshToken(payload: TokenPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d', // Thời gian sống lâu hơn so với access token
    });
  }

  public async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Refresh token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload: TokenPayload = {
      sub: user.id,
      username: user.username,
      roleId: user.roleId,
    };

    return this.generateToken(newPayload);
  }
}

export interface TokenPayload {
  sub: string;
  username: string;
  roleId: number;
}
