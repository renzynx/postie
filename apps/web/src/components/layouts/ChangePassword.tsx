import { Formik } from 'formik';
import Input from '@layouts/Input';
import { Button } from '@postie/ui';
import styles from '@styles/profile.module.scss';
import { useChangePasswordMutation } from '@features/user/user.api';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { toErrorMap } from '@lib/utils';

const Notification = dynamic(
  import('@postie/ui').then((mod) => mod.Notification)
);

const ChangePassword = () => {
  const [change, { isLoading }] = useChangePasswordMutation();
  const [opened, setOpened] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <>
      <Notification
        opened={opened}
        setOpen={setOpened}
        title={isError ? 'Error' : 'Success'}
      >
        {isError
          ? 'Something went terribly wrong, please try again later!'
          : 'Your password changed successfully!'}
      </Notification>
      <Formik
        initialValues={{
          old: '',
          password: '',
          confirm_password: '',
        }}
        validate={(values) => {
          if (!values.old) {
            return {
              old: 'Required!',
            };
          } else if (!values.password) {
            return {
              password: 'Required!',
            };
          } else if (values.confirm_password !== values.password) {
            return {
              confirm_password: 'Password does not match!',
              password: 'Password does not match!',
            };
          }
        }}
        onSubmit={(values, { setErrors }) =>
          change({
            old: values.old,
            password: values.password,
          })
            .unwrap()
            .then((success) => setOpened(success))
            .catch((err) => {
              if (err.status === 500) {
                setIsError(true);
              } else {
                setErrors(toErrorMap(err.data.errors));
              }
            })
        }
      >
        {({ values, handleSubmit, touched, errors }) => (
          <form onSubmit={handleSubmit} className={styles['form-control']}>
            <Input
              label="Current Password"
              name="old"
              type="password"
              value={values.old}
              error={touched.old && errors.old}
            />
            <Input
              label="New Password"
              name="password"
              type="password"
              value={values.password}
              error={touched.password && errors.password}
            />
            <Input
              label="Confirm New Password"
              name="confirm_password"
              type="password"
              value={values.confirm_password}
              error={touched.confirm_password && errors.confirm_password}
            />
            <Button
              style={{ marginTop: '1rem' }}
              type="submit"
              color="secondary"
              loading={isLoading}
            >
              Change password
            </Button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
