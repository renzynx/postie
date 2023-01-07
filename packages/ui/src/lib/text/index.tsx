import styles from './text.module.scss';
import React from 'react';

export type TextProps = {
  children?: React.ReactNode;
  component?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'primary' | 'secondary' | 'error';
  align?: 'left' | 'center' | 'right';
} & React.HTMLAttributes<HTMLParagraphElement>;

export function Text({ component = 'p', color, align, ...props }: TextProps) {
  const classNames = [
    styles['typography'],
    styles[color || ''],
    props.className,
    align ? styles[align] : '',
  ];

  return React.createElement(
    component,
    { className: classNames.join(' '), ...props },
    props.children
  );
}

export default Text;
