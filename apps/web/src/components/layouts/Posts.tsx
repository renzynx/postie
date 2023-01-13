import styles from '@styles/posts.module.scss';
import DetailedPost from './DetailedPost';
import SkeletonPost from './SkeletonPost';
import { useGetPostsQuery } from '@features/posts/posts.api';
import { Button, Notification, Text } from '@postie/ui';
import { useSelector } from 'react-redux';
import {
  selectPagination,
  setPagination,
} from '@features/posts/pagination.slice';
import { useAppDispatch } from '@app/store';
import { useEffect, useState } from 'react';
import { setPost } from '@features/posts/post.slice';

const Posts = () => {
  const dispatch = useAppDispatch();
  const pagination = useSelector(selectPagination);
  const { data, isLoading, isFetching } = useGetPostsQuery(pagination);
  const [opened, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isFetching && data?.posts.length) {
      dispatch(setPost(data.posts));
    }
  }, [data?.posts, dispatch, isFetching, isLoading]);

  return (
    <>
      <Notification
        title="Oops"
        color="danger"
        opened={opened}
        setOpen={setOpen}
      >
        <Text>There is no more posts to load.</Text>
      </Notification>
      {isFetching || (!data?.posts && isLoading) ? (
        [...Array(3)].map((_, idx) => (
          <div key={idx} className={styles['posts-container']}>
            <SkeletonPost />
          </div>
        ))
      ) : (
        <div className={styles['posts-container']}>
          {data?.posts.length ? (
            <>
              {data.posts.map((post) => (
                <DetailedPost key={post.id} post={post} withButton />
              ))}
              <Button
                style={{ marginTop: '1em', marginBottom: '1em', width: '15em' }}
                onClick={() =>
                  data.hasMore
                    ? dispatch(
                        setPagination({
                          limit: pagination.limit,
                          cursor: data.posts[data.posts.length - 1].id,
                        })
                      )
                    : setOpen(true)
                }
              >
                Load More
              </Button>
            </>
          ) : (
            <Text align="center" component="h2">
              Looks like there are no posts yet. Be the first to create one!
            </Text>
          )}
        </div>
      )}
    </>
  );
};

export default Posts;
