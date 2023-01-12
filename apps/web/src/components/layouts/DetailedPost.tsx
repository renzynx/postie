import styles from '@styles/posts.module.scss';
import { FC, useState } from 'react';
import Image from 'next/image';
import { Posts } from '@postie/shared-types';
import { Button, Text } from '@postie/ui';
import { IconThumbUp, IconThumbDown } from '@tabler/icons';
import Link from 'next/link';
import { useVotePostMutation } from '@features/posts/posts.api';
import dynamic from 'next/dynamic';
const Notification = dynamic(
  import('@postie/ui').then((mod) => mod.Notification)
);

const DetailedPost: FC<{
  post: Posts;
  withButton?: boolean;
}> = ({ post, withButton }) => {
  const [vote] = useVotePostMutation();
  const likeClassNames = [
    styles['like'],
    post.currentUserVoted === 1 && styles['like-active'],
  ].join(' ');
  const dislikeClassNames = [
    styles['dislike'],
    post.currentUserVoted === -1 && styles['dislike-active'],
  ].join(' ');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Notification
        opened={open}
        setOpen={setOpen}
        title="Error"
        color="danger"
      >
        You need to be logged in to vote!
      </Notification>
      <div className={styles['flex']}>
        <div className={styles['vote']}>
          <div className={likeClassNames}>
            <IconThumbUp
              size={30}
              stroke={1.5}
              onClick={() => {
                if (post.currentUserVoted === 1) {
                  return;
                }

                vote({
                  postId: post.id,
                  value: 1,
                })
                  .unwrap()
                  .catch(() => {
                    if (open) {
                      return;
                    } else {
                      setOpen(true);
                    }
                  });
              }}
            />
            <Text align="center">{post.likes}</Text>
          </div>

          <div
            className={dislikeClassNames}
            onClick={() => {
              if (post.currentUserVoted === -1) {
                return;
              }

              vote({
                postId: post.id,
                value: -1,
              })
                .unwrap()
                .catch(() => {
                  if (open) {
                    return;
                  } else {
                    setOpen(true);
                  }
                });
            }}
          >
            <IconThumbDown size={30} stroke={1.5} />
            <Text align="center">{post.dislikes}</Text>
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
    </>
  );
};

export default DetailedPost;
