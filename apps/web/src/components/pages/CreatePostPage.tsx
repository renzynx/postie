import styles from '@styles/createpost.module.scss';
import Input from '@layouts/Input';
import Navbar from '@layouts/Navbar';
import { Button, Text } from '@postie/ui';
import { Formik } from 'formik';
import { useCreatePostMutation } from '@features/posts/posts.api';
import { useSelector } from 'react-redux';
import { selectUser } from '@features/auth/auth.slice';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const Notification = dynamic(
  () => import('@postie/ui').then((mod) => mod.Notification),
  { ssr: false }
);

const CreatePostPage = () => {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Text component="h1" align="center" style={{ marginTop: '10px' }}>
        Create Post
      </Text>

      <Formik
        initialValues={{ title: '', content: '' }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.title) {
            errors.title = 'Required';
          } else if (values.title.length > 50) {
            errors.title = 'Must be 50 characters or less';
          } else if (values.title.length < 5) {
            errors.title = 'Must be 5 characters or more';
          } else if (!values.content) {
            errors.content = 'Required';
          } else if (values.content.length > 500) {
            errors.content = 'Must be 500 characters or less';
          } else if (values.content.length < 10) {
            errors.content = 'Must be 10 characters or more';
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          createPost({ ...values, published: true, userId: user.id })
            .unwrap()
            .then(() => {
              resetForm();
              setOpen(true);
            });
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form className={styles['container']} onSubmit={handleSubmit}>
            <Input
              name="title"
              label="Title"
              placeholder="Title"
              type="text"
              error={touched.title && errors.title}
            />
            <Input
              name="content"
              label="Content"
              textarea
              error={touched.content && errors.content}
            />
            <Button type="submit" color="secondary" loading={isLoading}>
              Create Post
            </Button>
          </form>
        )}
      </Formik>
      <Notification title="Success" opened={open} setOpen={setOpen}>
        Post created successfully
      </Notification>
    </>
  );
};

export default CreatePostPage;
