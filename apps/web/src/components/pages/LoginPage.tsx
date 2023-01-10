import styles from '@styles/auth.module.scss';
import { Text } from '@postie/ui';
import { Field, Formik } from 'formik';
import { Button } from '@postie/ui';
import Link from 'next/link';
import { useLoginMutation } from '@features/auth/auth.api';
import { toErrorMap } from '@lib/utils';
import { useRouter } from 'next/router';
import Input from '@layouts/Input';

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  return (
    <div className={styles['center']}>
      <Button
        style={{ position: 'absolute', top: '1rem', left: '1rem' }}
        color="secondary"
      >
        <Link href="/">Home</Link>
      </Button>
      <Formik
        initialValues={{ username_email: '', password: '', remember: false }}
        validate={(values) => {
          const errors = {} as Record<string, string>;
          if (!values.username_email) {
            errors.username_email = 'Required';
          } else if (!values.password) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={(values, { setErrors, resetForm }) => {
          login(values)
            .unwrap()
            .then((data) => {
              if (data.message) {
                resetForm({
                  values: { username_email: '', password: '', remember: false },
                });
                router.push('/', undefined, { shallow: true });
              }
            })
            .catch((error) => {
              setErrors(toErrorMap(error.data.errors));
            });
        }}
      >
        {({ handleSubmit, touched, errors }) => (
          <form
            autoComplete="off"
            className={styles['form-container']}
            onSubmit={handleSubmit}
          >
            <Text component="h2">Login</Text>
            <Input
              label="Username Or Email"
              name="username_email"
              error={
                touched.username_email && errors.username_email
                  ? errors.username_email
                  : undefined
              }
            />
            <Input
              label="Password"
              name="password"
              type="password"
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
            />
            <div className={styles['group']}>
              <div className={styles['checkbox-container']}>
                <Field
                  className={styles['checkbox']}
                  type="checkbox"
                  name="remember"
                  id="remember"
                />
                <label className={styles['checkbox-label']} htmlFor="remember">
                  <span className={styles['checkbox-span']}></span>
                  Remember me
                  <ins className={styles['checkbox-ins']}>
                    <i className={styles['checkbox-i']}>Remember me</i>
                  </ins>
                </label>
              </div>
              <Button
                style={{ width: '8rem' }}
                type="submit"
                loading={isLoading ?? false}
                disabled={isLoading ?? false}
              >
                Login
              </Button>
            </div>
            <div className={styles['group']}>
              <Link className={styles['dimmed']} href="/forgot-password">
                Forgot your password?
              </Link>
              <Link className={styles['dimmed']} href="/register">
                Don&apos;t have an account?
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
