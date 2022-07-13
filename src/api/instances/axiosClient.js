import axios from "axios";
import { baseURL } from "../../constants/api";
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
    // 'Access-Control-Allow-Origin': 'http://localhost:3000',
    // 'Access-Control-Allow-Credentials': true,
  },
  paramsSerializer: params => {
    return queryString.stringify(params, {
      encode: false,
    });
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("access_token");
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },

  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
