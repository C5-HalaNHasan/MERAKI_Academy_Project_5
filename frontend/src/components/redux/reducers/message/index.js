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
  },
});

export const { setAllMessages, setMessagesWith } = messageSlice.actions;
export default messageSlice.reducer;
