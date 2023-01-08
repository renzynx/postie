import styles from '@styles/posts.module.scss';
import Navbar from '@layouts/Navbar';
import { GetStaticPropsContext } from 'next';
import { FC } from 'react';
import DetailedPost from '@layouts/DetailedPost';
import CommentSection from '@layouts/CommentSection';
import { PrismaClient } from '@prisma/client';
import { Posts } from '@postie/shared-types';

const DetailPost: FC<{ post: Posts }> = ({ post }) => {
  return (
    <>
      <Navbar />
      <div className={styles['posts-container']}>
        <DetailedPost post={post} />
        <CommentSection />
      </div>
    </>
  );
};

export default DetailPost;

export async function getStaticProps(context: GetStaticPropsContext) {
  const { id } = context.params as Record<string, string>;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const prisma = new PrismaClient();

  const p = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: { select: { username: true } } },
  });

  if (!p) {
    return {
      notFound: true,
    };
  }

  await prisma.$disconnect();

  const content =
    p.content.length > 50
      ? p.content.slice(0, p.content.lastIndexOf(' ', 50 * 2)) + '...'
      : p.content;

  const post = {
    id: p.id,
    title: p.title,
    published: p.published,
    createdAt: p.createdAt,
    author: p.author.username,
    content,
  };

  return {
    // nextjs scalar types fix
    props: { post: JSON.parse(JSON.stringify(post)) },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const prisma = new PrismaClient();

  const posts = await prisma.post.findMany({
    where: { published: true },
  });

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  await prisma.$disconnect();

  return { paths, fallback: 'blocking' };
}
