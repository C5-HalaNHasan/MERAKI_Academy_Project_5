import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        token: localStorage.getItem("token") || "",
    },
    reducers:{
        setLogin:(state,action)=>{
            // action:{payload:token from the login backend response}//! userId & token
            state.token=action.payload;
            localStorage.setItem("token",`Bearer ${action.payload}`); //!
        },
        setLogout:(state,action)=>{
            state.token="";
            localStorage.clear();
        },

    }
});

export const {setLogin,setLogout}=userSlice.actions;
export default userSlice.reducer;