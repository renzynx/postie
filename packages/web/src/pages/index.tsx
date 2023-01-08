import { useGetPostsQuery } from '@features/posts/posts.api';
import { useState } from 'react';
import Navbar from '@layouts/Navbar';
import Posts from '@layouts/Posts';
import LoadingPage from '@pages/LoadingPage';

export function Index() {
  const [cursor, setCursor] = useState<number | null>(null);
  const { data, error, isLoading, isFetching } = useGetPostsQuery({});

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Navbar />
      <Posts posts={data} fetching={isFetching} />
    </>
  );
}

export default Index;
