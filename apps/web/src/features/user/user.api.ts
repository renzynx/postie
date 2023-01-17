import { apiSlice } from '@app/api/api.slice';

export const userApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendVerifyEmail: builder.mutation<boolean, void>({
      query: () => ({
        url: '/users/verify/email',
        method: 'GET',
      }),
    }),
    changePassword: builder.mutation<
      boolean,
      { old: string; password: string }
    >({
      query: (body) => ({
        url: '/users/change-password',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useSendVerifyEmailMutation, useChangePasswordMutation } =
  userApiSlice;
