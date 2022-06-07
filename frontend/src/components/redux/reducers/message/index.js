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
    addToMessages: (state, action) => {
      //! to be deleted if not used
      state.messagesWith.push(action.payload);
    },
    removeFromMessages: (state, action) => {
      //! to be deleted if not used
      state.messagesWith = state.messagesWith.filter((message, index) => {
        return message.id != action.payload;
      });
    },
  },
});

export const {
  setAllMessages,
  setMessagesWith,
  addToMessages,
  removeFromMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
