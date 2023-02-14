import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchRemovePost = createAsyncThunk('/posts/fetchRemovePost', async (id) => {
  await axios.delete(`/posts/${id}`);
});

export const fetchPostsByDate = createAsyncThunk('posts/fetchPostsByDate', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPostsByPopularity = createAsyncThunk('posts/fetchPostsByPopularity', async () => {
  const { data } = await axios.get('/popular-posts');
  return data;
});

export const fetchPostsWithTagByDate = createAsyncThunk(
  'posts/fetchPostsWithTagByDate',
  async (tagname) => {
    const { data } = await axios.get(`/tags/${tagname}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // get posts by date
    [fetchPostsByDate.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsByDate.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsByDate.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // get posts by popularity
    [fetchPostsByPopularity.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsByPopularity.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsByPopularity.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // get posts by tags
    [fetchPostsWithTagByDate.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsWithTagByDate.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsWithTagByDate.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // get tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // remove article
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    },
  },
});

export const postsReducer = postsSlice.reducer;
