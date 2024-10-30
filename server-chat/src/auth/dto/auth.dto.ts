import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  @Expose()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Exclude()
  roleId: number;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  @Expose()
  password: string;
}

export class LoginResponseDto {
  access_token: string;
  refreshToken: string;
  //user: UserDto;  // Nếu muốn trả thêm thông tin user
}
