import styles from '@styles/menu.module.scss';
import { Text } from '@postie/ui';
import { FC, ReactNode, useEffect, useRef } from 'react';

type MenuProps = {
  title: string;
  children?: ReactNode;
  open: boolean;
  target: ReactNode;
  setOpened: (open: boolean) => void;
};

const Menu: FC<MenuProps> = ({ title, children, open, target, setOpened }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpened(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div className={styles['menu']}>
        <div className={styles['menu-target']}>{target}</div>
        {open ? (
          <div className={styles['menu-dropdown']} ref={ref}>
            <div className={styles['menu-title']}>
              <Text component="p">{title}</Text>
            </div>
            <div className={styles['divider']}></div>
            <div className={styles['menu-item']}>{children}</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Menu;
