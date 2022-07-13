import { createSlice, nanoid } from '@reduxjs/toolkit';

export const initState = {
  searchItem: [
    {
      _id: nanoid(),
      content: '',
    },
  ],
};
const findIndex = (products, id) => {
  var result = -1;
  products?.forEach((product, index) => {
    if (product?._id === id) {
      result = index;
    }
  });
  return result;
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initState,
  reducers: {
    getSearchItemUserApi: (state, action) => {
      if (action.payload) {
        state.searchItem = action.payload;
      }
    },
    addSearchItemUserApi: (state, action) => {
      const searchItem = {
        content: action.payload,
        _id: nanoid(),
      };
      const indexSearch = findIndex(state.searchItem, searchItem._id);
      if (indexSearch === -1) {
        if (state.searchItem) {
          state.searchItem.unshift(searchItem);
        } else {
          const searchesItem = [];
          searchesItem.unshift(searchItem);
          state.searchItem = searchesItem;
        }
      } else {
        const tmp = state.searchItem[0];
        state.searchItem[0] = state.searchItem[indexSearch];
        state.searchItem[indexSearch] = tmp;
      }
    },
    deleteSearchItemUserApi: (state, action) => {
      if (action.payload) {
        state.searchItem = state.searchItem.filter(
          (item) => item._id !== action.payload
        );
      }
    },
  },
});

const { actions, reducer } = searchSlice;
export const searchItemSelector = (state) => state.reducer?.searchItem;

export const {
  getSearchItemUserApi,
  addSearchItemUserApi,
  deleteSearchItemUserApi,
} = actions;
export default reducer;
