import styles from '@styles/posts.module.scss';
import { useEffect, useState } from 'react';
import { Posts } from '@postie/shared-types';
import DetailedPost from './DetailedPost';
import SkeletonPost from './SkeletonPost';
import { useGetPostsQuery } from '@features/posts/posts.api';

const Posts = () => {
  const [cursor, setCursor] = useState<number | null>(null);
  const { data, isLoading, isFetching } = useGetPostsQuery({
    limit: 10,
    cursor,
  });
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    if (data) {
      setPosts((prev) => [...prev, ...data.posts]);
    }
  }, [data]);

  return (
    <>
      {isLoading && isFetching && !posts ? (
        [...Array(10)].map((_, idx) => (
          <div key={idx} className={styles['posts-container']}>
            <SkeletonPost />
          </div>
        ))
      ) : (
        <div className={styles['posts-container']}>
          {posts.map((post) => (
            <DetailedPost
              key={post.id}
              post={post}
              withButton
              idname={post.idname}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
