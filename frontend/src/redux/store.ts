import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice.ts'
import authRememberMeReducer from './features/auth/authRememberMeSlice.ts'
import { apiSlice } from './api/apiSlice.ts'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        authRememberMe: authRememberMeReducer

    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})
export type RootState = ReturnType<typeof store.getState>

export default store