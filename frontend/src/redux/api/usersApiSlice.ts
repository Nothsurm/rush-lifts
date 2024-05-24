import { apiSlice } from './apiSlice.js';
import { USERS_URL } from '../constants.js';

export const userApiSlice = apiSlice.injectEndpoints ({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/createUser`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<any,void>({
            query: () => ({
                url: `${USERS_URL}/logoutUser`,
                method: 'POST',
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/loginUser`,
                method: 'POST',
                body: data,
            }),
        }),
        google: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/google`,
                method: 'POST',
                body: data,
            }),
        }),
    })
})

export const {
    useRegisterMutation,
    useLogoutMutation,
    useLoginMutation,
    useGoogleMutation,
} = userApiSlice