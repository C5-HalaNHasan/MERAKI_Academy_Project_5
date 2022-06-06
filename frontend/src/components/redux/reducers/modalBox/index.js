import { createSlice } from "@reduxjs/toolkit";

const modalBoxSlice = createSlice({
  name: "modalBox",
  initialState: {
    user: "",
    type: "",
    message: "",
    details: "",
    show: false,
  },
  reducers: {
    setModalBox: (state, action) => {
      // action:{payload:{user,type,message,details,show}}
      state.user = action.payload.user || state.user;
      state.type = action.payload.type || state.type;
      state.message = action.payload.message || state.message;
      state.details = action.payload.details || state.details;
      state.show = action.payload.show || state.show;
    },
  },
});

export const { setModalBox } = modalBoxSlice.actions;
export default modalBoxSlice.reducer;
