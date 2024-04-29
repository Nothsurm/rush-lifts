import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice.ts'
import { apiSlice } from './api/apiSlice.ts'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: { persistedReducer },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
})
export type RootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)