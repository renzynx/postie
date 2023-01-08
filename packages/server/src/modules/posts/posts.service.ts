import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPosts, PostArgs } from '@postie/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPost(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: { author: { select: { username: true } } },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async getPosts(data: GetPosts & { all: boolean }) {
    if (data.all) {
      return this.prismaService.post.findMany();
    }

    const { cursor, limit } = data;
    const posts = await this.prismaService.post.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit ?? 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!posts.length) return [];

    return posts.map((post) => {
      const content =
        post.content.length > 50
          ? post.content.slice(0, post.content.lastIndexOf(' ', 50 * 2)) + '...'
          : post.content;

      return {
        id: post.id,
        title: post.title,
        published: post.published,
        content,
        createdAt: post.createdAt,
        author: post.author.username,
      };
    });
  }

  async getPost(id: number) {
    return this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  async createPost(data: PostArgs) {
    const post = await this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.userId,
        published: data.published,
      },
      include: { author: { select: { username: true } } },
    });

    const content =
      post.content.length > 50
        ? post.content.slice(0, post.content.lastIndexOf(' ', 50 * 2)) + '...'
        : post.content;

    return {
      id: post.id,
      title: post.title,
      published: post.published,
      content,
      createdAt: post.createdAt,
      author: post.author.username,
    };
  }
}
