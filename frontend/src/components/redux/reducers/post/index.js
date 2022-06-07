import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    comments: [],
    postsReaction: [],
    commentsReactions: [],
  },
  reducers: {
    setAllPosts: (state, action) => {
      state.posts = action.payload;
    },

    addToPosts: (state, action) => {
      state.posts.push(action.payload);
    },

    removeFromPosts: (state, action) => {
      state.posts = state.posts.filter((element, index) => {
        return element.id != action.payload;
      });
    },

    updatePosts: (state, action) => {
      state.posts = state.posts.map((element, index) => {
        if (element.id == action.payload.id) {
          return {
            ...element,
            postText: action.payload.postText,
            postImg: action.payload.postImg,
            postVideo: action.payload.postVideo,
          };
        }

        if (element.id == action.payload.id && action.payload.isReported) {
          return { ...element, isReported: action.payload.isReported };
        }
        return element;
      });
    },
    setAllComments: (state, action) => {
      state.comments = action.payload;
    },
    addToComments: (state, action) => {
      state.comments.push(action.payload);
    },

    removeFromComments: (state, action) => {
      state.comments = state.comments.filter((element, index) => {
        return element.id != action.payload;
      });
    },

    updateComments: (state, action) => {
      state.comments = state.comments.map((element, index) => {
        if (element.id == action.payload.id) {
          return {
            ...element,
            comment: action.payload.comment,
          };
        }
        if (element.id == action.payload.id && action.payload.isReported) {
          return { ...element, isReported: action.payload.isReported };
        }
        return element;
      });
    },
    setAllPostsReactions: (state, action) => {
      state.postsReaction = action.payload;
    },
    addToPostsReactions: (state, action) => {
      state.postsReaction.push(action.payload);
    },
    removeFromPostsReactions: (state, action) => {
      state.postsReaction = state.postsReaction.filter((element, index) => {
        return element.id != action.payload;
      });
    },
    setAllCommentsReactions: (state, action) => {
      state.commentsReactions = action.payload;
    },
    addToCommentsReactions: (state, action) => {
      state.commentsReactions.push(action.payload);
    },
    removeFromCommentsReactions: (state, action) => {
      state.commentsReactions = state.commentsReactions.filter(
        (element, index) => {
          return element.id != action.payload;
        }
      );
    },
  },
});

export const {
  setAllPosts,
  addToPosts,
  removeFromPosts,
  updatePosts,
  setAllComments,
  addToComments,
  removeFromComments,
  updateComments,
  setAllPostsReactions,
  addToPostsReactions,
  removeFromPostsReactions,
  setAllCommentsReactions,
  addToCommentsReactions,
  removeFromCommentsReactions,
} = postSlice.actions;
export default postSlice.reducer;
