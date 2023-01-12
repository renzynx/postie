import styles from '@styles/posts.module.scss';
import Navbar from '@layouts/Navbar';
import DetailedPost from '@layouts/DetailedPost';
import CommentSection from '@layouts/CommentSection';
import { useFindPostQuery } from '@features/posts/posts.api';
import { useRouter } from 'next/router';
import LoadingPage from '@pages/LoadingPage';
import Error from 'next/error';
import SkeletonPost from '@layouts/SkeletonPost';

const DetailPost = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { isLoading, data, isError } = useFindPostQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Navbar />
      <div className={styles['posts-container']}>
        {isLoading || router.isFallback ? (
          <SkeletonPost />
        ) : (
          <DetailedPost post={data} />
        )}
        <CommentSection />
      </div>
    </>
  );
};

export default DetailPost;
