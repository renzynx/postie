import styles from '@styles/posts.module.scss';
import { FC } from 'react';
import Image from 'next/image';
import { Posts } from '@postie/shared-types';
import { Button, Text } from '@postie/ui';
import { IconThumbUp, IconThumbDown } from '@tabler/icons';
import Link from 'next/link';

const DetailedPost: FC<{
  post: Posts;
  withButton?: boolean;
  idname?: string;
}> = ({ post, withButton, idname }) => {
  return (
    <div className={styles['flex']} id={idname}>
      <div className={styles['vote']}>
        <div className={styles['like']}>
          <IconThumbUp size={30} stroke={1.5} />
        </div>
        <div className={styles['dislike']}>
          <IconThumbDown size={30} stroke={1.5} />
        </div>
      </div>
      <div className={styles['post']} key={post.id}>
        <div className={styles['post-header']}>
          <div className={styles['post-date']}>
            {new Date(post.createdAt)
              .toISOString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('-')
              .replace(/-/g, '/')}{' '}
            at {new Date(post.createdAt).toLocaleTimeString()}
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
        <div className={styles['divider']}></div>
        <div className={styles['post-body']}>
          <div>
            {post.content.split('\n').map((p, i) => (
              <Text key={i} component="p">
                {p}
              </Text>
            ))}
          </div>
        </div>
        {withButton && (
          <Button color="secondary">
            <Link href={`/post/${post.id}`}>Go to post</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetailedPost;
