import ChangePassword from '@layouts/ChangePassword';
import styles from '@styles/profile.module.scss';
import { Button, Text } from '@postie/ui';
import Navbar from '@layouts/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '@features/auth/auth.slice';
import { IconCheck } from '@tabler/icons';
import { useSendVerifyEmailMutation } from '@features/user/user.api';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Notification = dynamic(
  import('@postie/ui').then((mod) => mod.Notification)
);

const ProfilePage = () => {
  const [opened, setOpened] = useState(false);
  const user = useSelector(selectUser);
  const [verify, { isLoading, isError }] = useSendVerifyEmailMutation();

  return (
    <>
      <Navbar />
      <Notification
        opened={opened}
        setOpen={setOpened}
        title={isError ? 'Error' : 'Success'}
      >
        {isError
          ? 'Something went wrong while sending the email, please try again later'
          : 'Please check your inbox for the verification email'}
      </Notification>
      <div className={styles['container']}>
        <div className={styles['section']}>
          <Text component="h2">Change your password</Text>
          <div className={styles['divider']}></div>
          <ChangePassword />
        </div>
        <div className={styles['section']}>
          <Button
            color={user?.verified ? 'primary' : 'secondary'}
            style={{
              height: '4em',
              fontSize: 'large',
            }}
            disabled={!!user?.verified || !user}
            loading={isLoading}
            onClick={() =>
              verify()
                .unwrap()
                .then((d) => d && setOpened(true))
            }
          >
            {user?.verified ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '.5em' }}
              >
                <Text>Your email address is verified</Text>
                <IconCheck size={30} />
              </div>
            ) : (
              'Verify your email address'
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
