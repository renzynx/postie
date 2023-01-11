import styles from '@styles/navbar.module.scss';
import { Button, Text } from '@postie/ui';
import { useRouter } from 'next/router';
import {
  authApiSlice,
  useLogoutMutation,
  useProfileQuery,
} from '@features/auth/auth.api';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@app/store';
import Menu from './Menu';
import { useState } from 'react';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const { data, isError } = useProfileQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch<AppDispatch>();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <div className={styles['navbar-container']}>
        <div className={styles['navbar']}>
          <div className={styles['navbar-left']}>
            <div className={styles['navbar-logo']}>
              <Link href="/" passHref>
                <Text component="h2">Postie</Text>
              </Link>
            </div>
          </div>
          <div className={styles['navbar-middle']}></div>
          <div className={styles['navbar-right']}>
            {data && !isError ? (
              <>
                <Menu
                  title={data.username}
                  open={opened}
                  setOpened={setOpened}
                  target={
                    <div
                      className={styles['navbar-avatar-container']}
                      onClick={() => setOpened(!opened)}
                    >
                      <Image
                        className={styles['navbar-avatar']}
                        src={`https://avatars.dicebear.com/api/identicon/${data.username}.svg`}
                        alt="avatar"
                        width={32}
                        height={32}
                      />
                    </div>
                  }
                >
                  <Button
                    onClick={() => router.push('/create-post')}
                    style={{ width: '10rem' }}
                  >
                    Create Post
                  </Button>
                  <Button
                    style={{ width: '10rem' }}
                    color="error"
                    loading={isLoading}
                    onClick={() =>
                      logout()
                        .unwrap()
                        .then(() => dispatch(authApiSlice.util.resetApiState()))
                    }
                  >
                    Logout
                  </Button>
                </Menu>
              </>
            ) : (
              <>
                <Button onClick={() => router.push('/login')}>Login</Button>
                <Button onClick={() => router.push('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
