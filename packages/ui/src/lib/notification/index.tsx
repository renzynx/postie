import styles from './notification.module.scss';
import { FC, ReactNode, useCallback, useEffect } from 'react';
import Text from '../text';
import { IconX } from '@tabler/icons';

export type NotificationProps = {
  children: ReactNode;
  title: string;
  opened: boolean;
  setOpen: (value: boolean) => void;
  color?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
  autoClose?: number | false;
};

export const Notification: FC<NotificationProps> = ({
  children,
  title,
  color,
  opened,
  setOpen,
  icon,
  autoClose = 5000,
}) => {
  const classNames = [styles['notification'], styles[color ?? 'secondary']];

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (opened && autoClose) {
      const timeout = setTimeout(() => {
        close();
      }, autoClose);
      return () => clearTimeout(timeout);
    }
  }, [autoClose, close, opened, setOpen]);

  return opened ? (
    <div className={classNames.join(' ')}>
      {icon && <div className={styles['icon']}>{icon}</div>}
      <div className={styles['body']}>
        <div className={styles['title']}>
          <Text component="h3">{title}</Text>
          <IconX onClick={close} className={styles['close-button']} size={16} />
        </div>
        <div className={styles['description']}>{children}</div>
      </div>
    </div>
  ) : null;
};

export default Notification;
