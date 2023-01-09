import styles from '@styles/auth.module.scss';
import { Text } from '@postie/ui';
import { Formik } from 'formik';
import { Button } from '@postie/ui';
import Link from 'next/link';
import { useRegisterMutation } from '@features/auth/auth.api';
import { useRouter } from 'next/router';
import { toErrorMap } from '@lib/utils';
import Input from '@layouts/Input';

const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
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
            .then(() => {
              resetForm({
                values: { email: '', username: '', password: '' },
              });
              router.push('/', undefined, { shallow: true });
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
            <Text component="h2">Register</Text>
            <Input
              label="Username"
              name="username"
              error={
                touched.username && errors.username
                  ? errors.username
                  : undefined
              }
            />
            <Input
              label="Email"
              name="email"
              error={touched.email && errors.email ? errors.email : undefined}
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
