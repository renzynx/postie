import styles from '@styles/posts.module.scss';
import Navbar from '@layouts/Navbar';
import { Post } from '@prisma/client';
import { GetStaticPropsContext } from 'next';
import { FC } from 'react';
import DetailedPost from '@layouts/DetailedPost';
import CommentSection from '@layouts/CommentSection';

const DetailPost: FC<{ post: Post & { author: { name: string } } }> = ({
  post,
}) => {
  return (
    <>
      <Navbar />
      <div className={styles['posts-container']}>
        <DetailedPost
          post={{
            author: post.author.name,
            content: post.content,
            title: post.title,
            createdAt: post.createdAt,
            published: post.published,
            id: post.id,
          }}
        />
        <CommentSection />
      </div>
    </>
  );
};

export default DetailPost;

export async function getStaticProps(context: GetStaticPropsContext) {
  const { id } = context.params as Record<string, string>;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
  const post = await res.json();

  if (!res.ok) {
    throw new Error(post.message);
  }

  return {
    props: { post },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?all=true`);
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}
