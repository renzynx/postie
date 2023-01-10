import styles from '@styles/input.module.scss';
import { Field, ErrorMessage } from 'formik';
import { FC } from 'react';

type InputProps = {
  label: string;
  error?: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: FC<InputProps> = ({ label, error, textarea, ...props }) => {
  return (
    <div className={styles['input-container']}>
      <label htmlFor={props.name}>{label}</label>
      <Field
        {...props}
        className={styles['input']}
        name={props.name}
        as={textarea ? 'textarea' : 'input'}
        rows={textarea ? 10 : undefined}
        style={{ paddingTop: textarea ? '5px' : '0px' }}
        maxLength={textarea ? 500 : undefined}
      />
      {error && (
        <ErrorMessage
          className={styles['error']}
          name={props.name}
          component="div"
        />
      )}
    </div>
  );
};

export default Input;
