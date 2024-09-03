import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:7020";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1/user`,
    credentials: "include",
  }),
  endpoints: builder => ({
    registerUser: builder.mutation({
      query: user => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: credentials => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUsers: builder.query({
      query: () => "/",
    }),
    getCurrentUser: builder.query({
      query: () => "/current",
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: id => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
} = userApi;
