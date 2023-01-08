import { Text } from '@postie/ui';
import styles from '@styles/loader.module.scss';
import { Loader } from '@postie/ui';

const LoadingPage = () => {
  return (
    <div className={styles['center']}>
      <Loader color="primary" />

      <Text component="h1">Loading...</Text>
    </div>
  );
};

export default LoadingPage;
