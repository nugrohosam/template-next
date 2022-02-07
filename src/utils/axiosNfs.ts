import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from 'config';
import { camelizeKeys, decamelizeKeys } from 'humps';

// Axios for NFS Endpoint
const axiosNfs = Axios.create({
  baseURL: config.nfsApiURL,
});

axiosNfs.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      response.headers['content-type'] === 'application/json; charset=utf-8'
    ) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (
      error.response?.data &&
      error.response?.headers['content-type'] ===
        'application/json; charset=utf-8'
    ) {
      error.response.data = camelizeKeys(error.response.data);
    }
    if (error.response?.status === 401) {
      localStorage.setItem('token', '');
      localStorage.setItem('management', '');
      window.location.href = process.env.PAMAFIX_LOGOUT_URL as string;
    }
    throw error.response?.data;
  }
);
axiosNfs.interceptors.request.use((config: AxiosRequestConfig) => {
  const newConfig = { ...config };
  newConfig.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
  if (newConfig.headers['Content-Type'] === 'multipart/form-data')
    return newConfig;
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }
  return newConfig;
});

export default axiosNfs;
