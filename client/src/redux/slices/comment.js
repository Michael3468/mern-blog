import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchLastComments = createAsyncThunk('comments/fetchLastComments', async () => {
  const { data } = await axios.get('/last-comments');
  return data;
});

export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId) => {
    const { data } = await axios.get(`/post-comments/${postId}`);
    return data;
  }
);

export const fetchRemovePostComments = createAsyncThunk(
  'comments/fetchRemovePostComments',
  async (postId) => {
    const { data } = await axios.delete(`/post-comments/${postId}`);
    return data;
  }
);

const initialState = {
  comments: {
    items: [],
    status: 'loading',
  },
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCommentsByPostId.pending]: (state) => {
      state.comments.status = 'loading';
    },
    [fetchCommentsByPostId.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchCommentsByPostId.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },

    [fetchLastComments.pending]: (state) => {
      state.comments.status = 'loading';
    },
    [fetchLastComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchLastComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },

    [fetchRemovePostComments.pending]: (state) => {
      state.comments.status = 'loading';
    },
    [fetchRemovePostComments.fulfilled]: (state, action) => {
      state.comments.status = 'loaded';
    },
    [fetchRemovePostComments.rejected]: (state) => {
      state.comments.status = 'error';
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
