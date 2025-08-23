import { createSlice } from "@reduxjs/toolkit";

const JwtSlice= createSlice({
    name: 'jwt',
    initialState: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
    reducers:{
        setJwt: (state, action) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload);
            }
            state =action.payload;
            return state;
        },
        removeJwt: (state) => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            state = "";
            return state;
        }
    }
});

export const { setJwt, removeJwt } = JwtSlice.actions;
export default JwtSlice.reducer;