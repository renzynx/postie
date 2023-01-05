import styles from '@styles/auth.module.scss';
import { Text } from '@postie/ui';
import { ErrorMessage, Field, Formik } from 'formik';
import { Button } from '@postie/ui';
import Link from 'next/link';
import { useRegisterMutation } from '@features/auth/auth.api';
import { useRouter } from 'next/router';
import { setCredentials } from '@features/auth/auth.slice';
import { useDispatch } from 'react-redux';

const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className={styles['center']}>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        validate={(values) => {
          const errors = {} as Record<string, string>;
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          } else if (!values.username) {
            errors.username = 'Required';
          } else if (!values.password) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={(values, { setErrors, resetForm }) => {
          register(values)
            .unwrap()
            .then((data) => {
              dispatch(setCredentials({ access_token: data.access_token }));
              resetForm({
                values: { email: '', username: '', password: '' },
              });
              router.push('/', undefined, { shallow: true });
            });
        }}
      >
        {({ handleSubmit, touched, errors }) => (
          <form className={styles['form-container']} onSubmit={handleSubmit}>
            <Text component="h2">Register</Text>
            <div className={styles['input-container']}>
              <label htmlFor="username">Username</label>
              <Field className={styles['input']} name="username" />
              {touched.username && errors.username && (
                <ErrorMessage
                  className={styles['error']}
                  name="email"
                  component="div"
                />
              )}
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="email">Email</label>
              <Field className={styles['input']} name="email" />
              {touched.email && errors.email && (
                <ErrorMessage
                  className={styles['error']}
                  name="email"
                  component="div"
                />
              )}
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="password">Password</label>
              <Field
                className={styles['input']}
                type="password"
                name="password"
              />

              <ErrorMessage
                className={styles['error']}
                name="password"
                component="div"
              />
            </div>
            <div className={styles['group']}>
              <Link className={styles['dimmed']} href="/login">
                Already have an account?
              </Link>
              <Button
                style={{ width: '8rem' }}
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                Register
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
