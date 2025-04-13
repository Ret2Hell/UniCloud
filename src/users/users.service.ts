import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns user_id, username, email
   * @throws ConflictException
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<Pick<User, 'user_id' | 'username' | 'email'>> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
      },
    });
  }

  /**
   * Find a user by email
   * @param email
   * @returns User
   * @throws NotFoundException
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID
   * @param id
   * @returns User
   * @throws NotFoundException
   */
  async findUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { user_id: id },
    });
  }

  /**
   * Find a user by username
   * @param username
   * @returns User
   */
  async findUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Update a user
   * @param updateUserDto
   * @returns User
   */
  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { user_id, ...data } = updateUserDto;
    return await this.prisma.user.update({
      where: { user_id },
      data,
    });
  }
}
