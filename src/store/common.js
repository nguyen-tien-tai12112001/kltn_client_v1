import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { ENDPOINT } from '../constants/api';

const socket = io(ENDPOINT);
export const initState = {
  configs: {},
  isLogged: false,
  loginForm: false,
  registerForm: false,
  addresses: [],
  socket:socket,
  notifWs: null,
  userInfo: {
    _id: '',
    first_name: '',
    last_name: '',
    avt: '',
    email: '',
    phone: '',
    sex: '',
    role: '',
  },
};

const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    toggleLogged(state, action) {
      state.isLogged = action.payload;
    },
    setConfigs(state, action) {
      state.configs = action.payload;
    },
    setAddresses(state, action) {
      state.addresses = action.payload;
    },
    toggleLoginForm(state, action) {
      state.loginForm = action.payload;
    },
    toggleRegisterForm(state, action) {
      state.registerForm = action.payload;
    },
  },
});

const { actions, reducer } = commonSlice;

export const commonActions = actions;
export default reducer;
