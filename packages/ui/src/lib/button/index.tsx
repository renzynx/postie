import styles from './button.module.scss';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

export type ButtonProps = {
  children?: ReactNode;
  color?: 'primary' | 'secondary' | 'error';
  loading?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button({ color = 'primary', loading, ...props }: ButtonProps) {
  const classNames = [styles['container'], styles[color], props.className];

  return (
    <button {...props} className={classNames.join(' ')}>
      {loading ? (
        <span className={styles['loading']}></span>
      ) : (
        <span>{props.children}</span>
      )}
    </button>
  );
}

export default Button;
