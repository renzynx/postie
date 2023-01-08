import styles from '@styles/navbar.module.scss';
import { Button, Text } from '@postie/ui';
import { useRouter } from 'next/router';
import { useProfileQuery } from '@features/auth/auth.api';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const { data } = useProfileQuery();

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
            {data ? (
              <Button onClick={() => router.push('/create-post')}>
                Create Post
              </Button>
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
