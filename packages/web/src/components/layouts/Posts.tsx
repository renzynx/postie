/* eslint-disable @next/next/no-img-element */
import styles from '@styles/posts.module.scss';
import React from 'react';
import { Posts } from '@postie/shared-types';
import DetailedPost from './DetailedPost';

type PostsProps = {
  posts: Posts[];
  fetching: boolean;
};

const Posts: React.FC<PostsProps> = ({ fetching, posts }) => {
  return (
    <>
      {fetching ? (
        <div>Loading...</div>
      ) : (
        <div className={styles['posts-container']}>
          {posts.map((post) => (
            <DetailedPost key={post.id} post={post} withButton />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
