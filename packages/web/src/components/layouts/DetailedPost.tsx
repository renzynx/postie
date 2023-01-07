import styles from '@styles/posts.module.scss';
import React, { FC } from 'react';
import Image from 'next/image';
import { Posts } from '@postie/shared-types';
import { useRouter } from 'next/router';
import { Text } from '@postie/ui';

const DetailedPost: FC<{ post: Posts; redir?: boolean }> = ({
  post,
  redir,
}) => {
  const router = useRouter();

  return (
    <div
      className={styles['post']}
      key={post.id}
      onClick={() => {
        redir && router.push(`/post/${post.id}`);
      }}
    >
      <div className={styles['post-header']}>
        <div className={styles['post-date']}>
          {new Date(post.createdAt)
            .toISOString()
            .split('T')[0]
            .split('-')
            .reverse()
            .join('-')
            .replace(/-/g, '/')}
        </div>
        <div className={styles['post-author']}>
          <Image
            className={styles['author-avatar']}
            src={`https://avatars.dicebear.com/api/identicon/${post.author}.svg`}
            alt="Avatar"
            width={32}
            height={32}
          />
          <div className={styles['author-name']}>{post.author}</div>
        </div>
      </div>
      <div className={styles['post-title']}>
        <Text component="h2">{post.title}</Text>
      </div>
      <div className={styles['post-body']}>
        <div>{post.content.split('\\').join('\n')}</div>
      </div>
    </div>
  );
};

export default DetailedPost;
