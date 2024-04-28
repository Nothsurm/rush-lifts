import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: 
        sessionStorage.getItem(import.meta.env.VITE_STORAGE_KEY as string) 
        ? JSON.parse(sessionStorage.getItem(import.meta.env.VITE_STORAGE_KEY) as string) 
        : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            sessionStorage.setItem(import.meta.env.VITE_STORAGE_KEY, JSON.stringify(action.payload))
        },

        logoutSessionStorage: (state) => {
            state.userInfo = null;
            sessionStorage.clear();
        },
    },
});

export const { setCredentials, logoutSessionStorage } = authSlice.actions;

export default authSlice.reducer;