import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpException,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { ConfigService } from '@nestjs/config';
import { ResponseUtil } from 'src/utils/reponse.util';
import { Cookie } from './decorators/cookie.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '@prisma/client';

interface CustomError {
  message: string;
  status: number;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserInput })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async signUp(@Body() signUpDto: CreateUserInput) {
    try {
      const result = await this.authService.signUp(signUpDto);
      return ResponseUtil.success(
        'User signed up successfully',
        result,
        HttpStatus.CREATED,
      );
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Registration failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async signIn(@Body() signInDto: SignInDto, @Cookie() response: Response) {
    try {
      const { id, access_token } = await this.authService.signIn(signInDto);
      this.setAuthCookies(response, { access_token });
      return ResponseUtil.success(
        'Sign in successful',
        {
          id,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Sign in failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async logout(@GetUser('sub') id: string, @Cookie() response: Response) {
    try {
      await this.authService.logout(id);
      this.removeAuthCookies(response);
      return ResponseUtil.success('Logged out successfully', null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Logout failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user information' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'User information retrieved' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  getUser(@GetUser() user: User) {
    try {
      return ResponseUtil.success('User information retrieved', user);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Failed to retrieve user information',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private setAuthCookies(response: Response, tokens: TokensResponseDto): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    // response.cookie('refresh_token', tokens.refresh_token, {
    //   httpOnly: true,
    //   secure: isProduction,
    //   sameSite: 'lax',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
  }

  private removeAuthCookies(response: Response): void {
    response.clearCookie('access_token', { httpOnly: true });
    // response.clearCookie('refresh_token', { httpOnly: true });
  }
}
