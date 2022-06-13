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
    addToMessagesWith: (state, action) => {
      state.messagesWith = [...state.messagesWith, action.payload];
    },
    removeFromMessagesWith: (state, action) => {
      state.messagesWith = state.messagesWith.filter((message, index) => {
        return message.id != action.payload;
      });
    },
  },
});

export const {
  setAllMessages,
  setMessagesWith,
  addToMessagesWith,
  removeFromMessagesWith,
} = messageSlice.actions;
export default messageSlice.reducer;
