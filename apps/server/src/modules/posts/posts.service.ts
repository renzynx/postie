import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetPosts, PostArgs } from '@postie/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPost(id: string, req: Request) {
    if (!id) {
      throw new BadRequestException();
    }

    const p = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        votes: {
          select: {
            value: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!p) {
      throw new NotFoundException();
    }

    let currentUserVoted: number = null;

    if (req.user) {
      currentUserVoted = p.votes.find(
        (v) => v.user.id === (req.user as { id: number }).id
      )?.value;
    }

    return {
      id: p.id,
      title: p.title,
      published: p.published,
      createdAt: p.createdAt,
      author: p.author.username,
      content: p.content,
      currentUserVoted,
      likes: p.votes.filter((v) => v.value === 1).length,
      dislikes: p.votes.filter((v) => v.value === -1).length,
    };
  }

  async getPosts(data: GetPosts & { all: boolean }, req: Request) {
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
        votes: {
          select: {
            value: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const formattedPosts = posts.length
      ? posts.map((post) => {
          const content =
            post.content.length > 50
              ? post.content.slice(0, 50) + '...'
              : post.content;

          let currentUserVoted: number = null;

          if (req.user) {
            currentUserVoted =
              post.votes.find(
                (vote) => vote.user.id === (req.user as { id: number }).id
              )?.value ?? null;
          }

          return {
            id: post.id,
            title: post.title,
            published: post.published,
            content,
            createdAt: post.createdAt,
            author: post.author.username,
            currentUserVoted,
            likes: post.votes.filter((vote) => vote.value === 1).length,
            dislikes: post.votes.filter((vote) => vote.value === -1).length,
          };
        })
      : [];

    return {
      posts: formattedPosts,
      hasMore: !!posts.length,
    };
  }

  async getPost(id: string) {
    return this.prismaService.post.findUnique({
      where: { id },
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
        ? post.content.slice(0, 50) + '...'
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

  async votePost({
    postId,
    userId,
    value,
  }: {
    userId: number;
    postId: string;
    value: number;
  }) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException();
    }

    const vote = await this.prismaService.vote.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (vote && vote.value === value) {
      throw new BadRequestException('Already voted');
    }

    !vote
      ? await this.prismaService.vote.create({
          data: {
            user: { connect: { id: userId } },
            post: { connect: { id: postId } },
            value,
          },
        })
      : await this.prismaService.vote.update({
          where: { postId_userId: { postId, userId } },
          data: { value },
        });

    return true;
  }
}
