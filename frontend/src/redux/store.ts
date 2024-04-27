import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice.ts'
import authRememberMeReducer from './features/auth/authRememberMeSlice.ts'

const store = configureStore({
    reducer: {
        auth: authReducer,
        authRememberMe: authRememberMeReducer

    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
})

export default store