import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostArgs } from '@postie/shared-types';
import { ProtectedGuard } from '../auth/guards/protected.guard';
import { PostsService } from './posts.service';
import { Request as ERQ } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getPosts(
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
    @Query('all') all: string,
    @Request() req: ERQ
  ) {
    const realLimit = limit && limit.length ? parseInt(limit) : 10;
    const realCursor = cursor && cursor.length ? cursor : undefined;
    const realAll = all && all.length ? all === 'true' : false;
    return this.postService.getPosts(
      {
        cursor: realCursor,
        limit: realLimit,
        all: realAll,
      },
      req
    );
  }

  @Get(':id')
  async findPost(@Param('id') id: string, @Request() req: ERQ) {
    return this.postService.findPost(id, req);
  }

  @UseGuards(ProtectedGuard)
  @Post('create')
  async createPost(@Body() body: PostArgs) {
    return this.postService.createPost(body);
  }

  @UseGuards(ProtectedGuard)
  @Post('vote')
  async votePost(
    @Body() body: { postId: string; value: number },
    @Request() req: ERQ
  ) {
    return this.postService.votePost({
      postId: body.postId,
      value: body.value,
      userId: (req.user as { id: number }).id,
    });
  }
}
