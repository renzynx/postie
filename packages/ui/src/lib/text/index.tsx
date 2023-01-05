import styles from './text.module.scss';
import React from 'react';

export type TextProps = {
  children?: React.ReactNode;
  component?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'primary' | 'secondary' | 'error';
} & React.HTMLAttributes<HTMLParagraphElement>;

export function Text(props: TextProps) {
  const { component = 'p' } = props;
  const classNames = [
    styles['typography'],
    styles[props.color || ''],
    props.className,
  ];

  return React.createElement(
    component,
    { className: classNames.join(' '), ...props },
    props.children
  );
}

export default Text;
