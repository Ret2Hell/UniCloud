import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   * @param createUserInput
   * @returns id, username, email
   * @throws ConflictException
   */
  async create(createUserInput: CreateUserInput) {
    return await this.prisma.user.create({
      data: {
        ...createUserInput,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  /**
   * Find a user by ID, email, or username
   * @param identifier
   * @returns User
   * @throws NotFoundException
   */
  async findOne(identifier: {
    id?: string;
    email?: string;
    username?: string;
  }) {
    const { id, email, username } = identifier;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id }, { email }, { username }],
      },
    });

    return user;
  }

  async update(updateUserInput: UpdateUserInput) {
    const { id, ...data } = updateUserInput;
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
