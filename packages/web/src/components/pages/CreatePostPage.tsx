import styles from '@styles/createpost.module.scss';
import Input from '@layouts/Input';
import Navbar from '@layouts/Navbar';
import { Button, Text } from '@postie/ui';
import { Formik } from 'formik';
import { postApiSlice, useCreatePostMutation } from '@features/posts/posts.api';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@features/auth/auth.slice';
import { AppDispatch } from '@app/store';

const CreatePostPage = () => {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  return (
    <>
      <Navbar />
      <Text component="h1" align="center" style={{ marginTop: '10px' }}>
        Create Post
      </Text>

      <Formik
        initialValues={{ title: '', content: '' }}
        onSubmit={(values) => {
          createPost({ ...values, published: true, userId: user.id })
            .unwrap()
            .then((data) => {
              dispatch(
                postApiSlice.util.updateQueryData(
                  'getPosts',
                  undefined,
                  (draft) => {
                    draft.unshift(data);
                  }
                )
              );
            });
        }}
      >
        {({ handleSubmit }) => (
          <form className={styles['container']} onSubmit={handleSubmit}>
            <Input name="title" label="Title" placeholder="Title" type="text" />
            <Input name="content" label="Content" textarea />
            <Button type="submit" color="secondary" loading={isLoading}>
              Create Post
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreatePostPage;
