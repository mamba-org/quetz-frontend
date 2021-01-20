import axios from 'axios';
import { isObject } from 'lodash';
import { stringify } from 'query-string';
import { BACKEND_HOST } from './constants';

const axiosRequest = axios.create({
  baseURL: BACKEND_HOST,
  responseType: 'json'
});

const handleResponse = (response: any, resolve: any, reject: any) => {
  if (response.status === 200) {
    return resolve({ data: response.data, error: false });
  }
  const promiseResponse = { ...response, error: true };
  return reject(promiseResponse);
};

const handleError = (e: any, reject: any) => {
  if (e.response) {
    const promiseResponse = { ...e.response?.data, status: e.response.status };
    return reject(promiseResponse);
  }
  return reject(e);
};

const http = {
  get: async (url: any, params: any) => {
    return new Promise((resolve, reject) => {
      const query = isObject(params)
        ? `?${stringify({ ...params })}`
        : params || '';

      axiosRequest
        .get(`${url}${query}`)
        .then(response => handleResponse(response, resolve, reject))
        .catch(e => handleError(e, reject));
    });
  },
  post: async (url: any, params: any, payload: any, config = {}) => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify({ ...params })}` : '';
      axiosRequest
        .post(`${url}${query}`, payload, config)
        .then(response => handleResponse(response, resolve, reject))
        .catch(e => handleError(e, reject));
    });
  },
  patch: async (url: any, params: any, payload: any, config = {}) => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify({ ...params })}` : '';
      axiosRequest
        .patch(`${url}${query}`, payload, config)
        .then(response => handleResponse(response, resolve, reject))
        .catch(e => handleError(e, reject));
    });
  },

  put: async (url: any, params: any, payload: any, config = {}) => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify({ ...params })}` : '';
      axiosRequest
        .put(`${url}${query}`, payload, config)
        .then(response => handleResponse(response, resolve, reject))
        .catch(e => handleError(e, reject));
    });
  },
  delete: async (url: any, params: any) => {
    return new Promise((resolve, reject) => {
      const query = params ? `/${params}` : '';

      axiosRequest
        .delete(`${url}${query}`)
        .then(response => handleResponse(response, resolve, reject))
        .catch(e => handleError(e, reject));
    });
  }
};

export { http };
