import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: 
        localStorage.getItem(import.meta.env.VITE_LOCALSTORAGE_KEY as string) 
        ? JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCALSTORAGE_KEY) as string) 
        : null,
}

const authRememberMeSlice = createSlice({
    name: 'authRememberMe',
    initialState,
    reducers: {
        setRememberMeCredentials: (state, action) => {
            state.userInfo = action.payload;
            const expirationTime = (new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString()
            localStorage.setItem('expirationTime', expirationTime)
            const todaysDate = (new Date().getTime()).toString()

            if (todaysDate > expirationTime) {
                localStorage.removeItem(import.meta.env.VITE_LOCALSTORAGE_KEY)
            } else {
                localStorage.setItem(import.meta.env.VITE_LOCALSTORAGE_KEY, JSON.stringify(action.payload))
            }
        },

        logout: (state) => {
            state.userInfo = null;
            localStorage.clear();
        },
    },
});

export const { setRememberMeCredentials, logout } = authRememberMeSlice.actions;

export default authRememberMeSlice.reducer;