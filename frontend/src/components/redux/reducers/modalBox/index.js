import { createSlice } from "@reduxjs/toolkit";

const modalBoxSlice = createSlice({
  name: "modalBox",
  initialState: {
    user:"",
    type:"",
    show:false,
  },
  reducers: {
    setModalBox: (state, action) => {
       // action:{payload:{user,type,show}}
      state.user = action.payload.user;
      state.type = action.payload.type;
      state.show = action.payload.show;
    },
  }
});

export const {setModalBox} = modalBoxSlice.actions;
export default modalBoxSlice.reducer;
