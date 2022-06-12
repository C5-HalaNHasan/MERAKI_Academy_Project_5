import { createSlice } from "@reduxjs/toolkit";

const modalBoxSlice = createSlice({
  name: "modalBox",
  initialState: {
    modalId: "",
    modalType: "",
    modalMessage: "",
    modalDetails: "",
    modalShow: false,
  },
  reducers: {
    setModalBox: (state, action) => {
      // action:{payload:{user,type,message,details,show}}
      state.modalId = action.payload.modalId || state.modalId;
      state.modalType = action.payload.modalType || state.modalType;
      state.modalMessage = action.payload.modalMessage || state.modalMessage;
      state.modalDetails = action.payload.modalDetails || state.modalDetails;
      state.modalShow = action.payload.modalShow;
    },
  },
});

export const { setModalBox } = modalBoxSlice.actions;
export default modalBoxSlice.reducer;
