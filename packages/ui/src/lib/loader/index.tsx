import styles from './loader.module.scss';
import { FC, HTMLAttributes } from 'react';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'blue' | 'red';
} & HTMLAttributes<HTMLDivElement>;

export const Loader: FC<LoaderProps> = ({ size = 'lg', color = 'primary' }) => {
  const classNames = [
    styles['loader'],
    styles[`loader--${size}`],
    styles[`loader--${color}`],
  ];

  return <div className={classNames.join(' ')}></div>;
};

export default Loader;
