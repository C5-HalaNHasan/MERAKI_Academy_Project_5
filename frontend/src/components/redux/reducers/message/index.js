import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    allMessages: [],
    messagesWith: [],
  },
  reducers: {
    setAllMessages: (state, action) => {
      state.allMessages = action.payload;
    },
    setMessagesWith: (state, action) => {
      state.messagesWith = action.payload;
    },
    //! check if needed
    addToMessagesWith: (state, action) => {
      state.messagesWith.push(action.payload);
    },
    // removeFromMessages: (state, action) => {
    //   state.messages = state.messages.filter((message, index) => {//! check if needed
    //     return message.id != action.payload;
    //   });
    // },
  },
});

export const {
  setAllMessages,
  setMessagesWith,
  addToMessagesWith, //! check if needed
} = messageSlice.actions;
export default messageSlice.reducer;
