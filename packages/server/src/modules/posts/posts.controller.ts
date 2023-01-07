import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostArgs } from '@postie/shared-types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
    @Query('all') all: string
  ) {
    const realLimit = limit && limit.length ? parseInt(limit) : 10;
    const realCursor = cursor && cursor.length ? parseInt(cursor) : undefined;
    const realAll = all && all.length ? all === 'true' : false;
    return this.postService.getPosts({
      cursor: realCursor,
      limit: realLimit,
      all: realAll,
    });
  }

  @Get(':id')
  async findPost(
    @Param('id', {
      transform: (value) => parseInt(value, 10),
    })
    id: number
  ) {
    return this.postService.findPost(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(@Body() body: PostArgs) {
    return this.postService.createPost(body);
  }
}
