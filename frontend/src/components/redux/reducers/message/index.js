import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: []
  },
  reducers: {
    setAllMessages: (state, action) => {
      state.messages = action.payload;
    },
    addToMessages: (state, action) => {
      state.messages.push(action.payload);
    },
    removeFromMessages: (state, action) => {
      state.messages = state.messages.filter((message, index) => {
        return message.id != action.payload;
      });
    }
  }
});

export const {setAllMessages,addToMessages,removeFromMessages} = messageSlice.actions;
export default messageSlice.reducer;
