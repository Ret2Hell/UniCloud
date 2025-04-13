import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: CreateUserInput) {
    // Validate password strength
    if (!this.isPasswordStrong(signUpDto.password)) {
      throw new BadRequestException(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    // check if a user with the same email already exists
    const existingUser = await this.usersService.findOne({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    // check if a user with the same username already exists
    const existingUsername = await this.usersService.findOne({
      username: signUpDto.username,
    });
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const hashedPassword = await this.hashingService.hash(signUpDto.password);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });
    return user;
  }

  async signIn(signInDto: SignInDto) {
    // Check if the user exists
    const user = await this.usersService.findOne({ email: signInDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the password is correct
    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.generateAccessToken(user.id);

    // Update both tokens in database
    await this.usersService.update({
      ...user,
      access_token,
    });

    return {
      access_token,
    };
  }

  async logout(id: string) {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Invalidate both access and refresh tokens
    await this.usersService.update({
      ...user,
      access_token: null,
    });
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  private async generateAccessToken(id: string) {
    const payload = {
      sub: id,
      type: 'access',
    };
    return await this.jwtService.signAsync(payload, {
      audience: this.configService.get('JWT_AUDIENCE'),
      issuer: this.configService.get('JWT_ISSUER'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
