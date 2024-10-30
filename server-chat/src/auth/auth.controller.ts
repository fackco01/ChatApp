import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto/auth.dto';
import { Public } from './guard/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(
    @Body() loginData: LoginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const response = await this.authService.login(loginData);
    return response;
  }

  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: RegisterDto,
  })
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    const response = await this.authService.register(registerData);
    return response;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
