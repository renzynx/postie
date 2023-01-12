import styles from '@styles/posts.module.scss';
import DetailedPost from './DetailedPost';
import SkeletonPost from './SkeletonPost';
import { useGetPostsQuery } from '@features/posts/posts.api';
import { Text } from '@postie/ui';
import { useSelector } from 'react-redux';
import { selectPagination } from '@features/posts/pagination.slice';

const Posts = () => {
  const pagination = useSelector(selectPagination);
  const { data, isLoading, isFetching } = useGetPostsQuery(pagination);

  return (
    <>
      {isFetching || (!data?.posts && isLoading) ? (
        [...Array(3)].map((_, idx) => (
          <div key={idx} className={styles['posts-container']}>
            <SkeletonPost />
          </div>
        ))
      ) : (
        <div className={styles['posts-container']}>
          {data?.posts.length ? (
            data.posts.map((post) => (
              <DetailedPost key={post.id} post={post} withButton />
            ))
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
