import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  tagTypes: ['User'], // Define User tag
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: (data) => ({
        url: 'refresh',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    loadUser: builder.query({
      query: (data) => ({
        url: 'me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['User'], // Cache user data with User tag
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken, // Verify this field exists
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log('Error loading user:', error);
        }
      },
    }),
    createOrder: builder.mutation({
      query: (orderPayload) => ({
        url: 'orders', // Adjust to your endpoint
        method: 'POST',
        body: orderPayload,
        credentials: 'include' as const,
      }),
      invalidatesTags: ['User'], // Invalidate User cache after order creation
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery, useCreateOrderMutation } = apiSlice;