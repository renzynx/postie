import { Post, User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export type PostData = Post & { user: UserWithoutPassword };

export type PostArgs = {
  title: string;
  content: string;
  published: boolean;
  userId: number;
};

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  verified: Date;
}

export interface LoginData {
  username_email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Payload {
  sub: number;
  iss: string;
  iat: number;
  user: {
    username: string;
    email: string;
  };
}

export interface GetPosts {
  cursor?: number;
  limit?: number;
}

export interface Posts {
  id: number;
  title: string;
  published: boolean;
  uuid: string;
  content: string;
  createdAt: Date;
  author: string;
  currentUserVoted: number | null;
  likes: number;
  dislikes: number;
}
