import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Username can only contain letters, numbers, underscores and hyphens',
  })
  public readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  public readonly password: string;

  @IsString()
  @IsNotEmpty()
  public readonly fullName: string;

  @IsInt()
  @IsNotEmpty()
  public readonly roleId: number;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;
}

export class GetUserDetailRequestDto {
  @IsNotEmpty()
  @IsInt()
  public readonly id: string;
}

export class ChangePasswordRequestDto {
  @IsNotEmpty()
  @IsInt()
  public readonly userId: number;

  @IsString()
  @IsNotEmpty()
  public readonly currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  public readonly newPassword: string;
}

export class UserResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public readonly username: string;

  @Expose()
  public readonly fullName: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly roleId: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetUsersQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId?: number;
}

export class UsersPageResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  data: UserResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  constructor(partial: Partial<UsersPageResponseDto>) {
    Object.assign(this, partial);
  }
}
