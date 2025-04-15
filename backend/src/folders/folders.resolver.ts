import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Folder } from './entities/folder.entity';
import { FoldersService } from './folders.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateFolderInput } from './dto/create-folder.input';
import { User } from '@prisma/client';

@Resolver(() => Folder)
export class FoldersResolver {
  constructor(private readonly foldersService: FoldersService) {}

  @Query(() => [Folder])
  async folders(@GetUser() user: User) {
    return this.foldersService.findRootFolders(user.id);
  }

  @Query(() => Folder)
  async folder(@Args('id') id: string) {
    return this.foldersService.findById(id);
  }

  @Mutation(() => Folder)
  async createFolder(
    @Args('input') input: CreateFolderInput,
    @GetUser('sub') id: string,
  ) {
    return this.foldersService.create(id, input);
  }
}
