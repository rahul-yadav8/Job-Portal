import { getResponseBody, handleErrors, handleHeaders } from './response'
import CookieStorage from '../cookie.storage'
import fetch from 'axios'
import LocalStorage from '../localstorage.storage'
/**
 * Performs an HTTP request to the specified URI with the given request data.
 *
 * @param uri - The URI to which the request is made.
 * @param apiUrl - The base URL of the API.
 * @param requestData - The request data to be sent with the request. Defaults to an empty object.
 * @returns A promise that resolves with the response body or rejects with an error.
 */
const _performRequest = (uri: string, apiUrl: string, requestData = {}) => {
  const url = `${apiUrl}${uri}`
  return new Promise((resolve, reject) => {
    fetch(url, requestData)
      .then(handleHeaders)
      .then(getResponseBody)
      .then((response: any) => resolve(response))
      .catch((error) => {
        handleErrors(error).catch(reject)
      })
  })
}

/**
 * Retrieves the session token from the cookie storage.
 *
 * @returns {Promise<string | null>} A promise that resolves with the token if it exists, or rejects with null if it does not.
 */
const getSession = () => {
  return new Promise((res, rej) => {
    const token = LocalStorage.read('access_token')
    if (token) return res(token)
    return rej(null)
  })
}

/**
 * Adds an Authorization header with a Bearer token to the request data.
 *
 * This function retrieves the session token asynchronously and sets it in the
 * Authorization header of the provided request data. If the token retrieval fails,
 * it returns the request data without modifying the headers.
 *
 * @param requestData - The request data object to which the Authorization header will be added.
 * @returns A promise that resolves to the modified request data with the Authorization header.
 */
const _addTokenHeader = (requestData: any) =>
  getSession()
    .then((token) => {
      requestData.headers.Authorization = `Bearer ${token}`
      return requestData
    })
    .catch(() => requestData)

/**
 * A utility class for making HTTP requests to a backend API.
 * Provides methods for GET, POST, PUT, PATCH, and DELETE requests.
 * // Example Usage:
 * // const response = await APIService.get('/api/data');
 * // const data = await response.json();
 * // console.log(data);
 */
export class APIService {
  /**
   * Promise which performs GET Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {String} authToken The Authorization Token.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async get(
    uri: string,
    authToken = undefined,
    apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? ''
  ) {
    let requestData: any = {
      method: 'get',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
      },
    }
    if (authToken) {
      requestData.headers.Authorization = `Bearer ${authToken}`
    } else {
      requestData = await _addTokenHeader(requestData)
    }
    return _performRequest(uri, apiUrl, requestData)
  }

  /**
   * Sends a POST request to the specified URI with the provided data.
   *
   * @param uri - The endpoint URI to send the POST request to.
   * @param data - The data to be sent in the body of the POST request.
   * @param apiUrl - The base API URL. Defaults to the value of `VITE_API_ENDPOINT` environment variable.
   * @returns A promise that resolves with the response of the POST request.
   */
  static async post(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData: any = {
      method: 'post',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
      data,
    }

    requestData = await _addTokenHeader(requestData)
    return _performRequest(uri, apiUrl, requestData)
  }

  /**
   * Uploads data to a specified URI.
   *
   * @param uri - The endpoint URI to which the data will be uploaded.
   * @param data - The data to be uploaded.
   * @param apiUrl - The base API URL. Defaults to the value of `VITE_API_ENDPOINT` from environment variables.
   * @returns A promise that resolves with the response of the upload request.
   */
  static async upload(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData = {
      method: 'post',
      headers: {},
      data,
    }
    requestData = await _addTokenHeader(requestData)
    return _performRequest(uri, apiUrl, requestData)
  }

  /**
   * Sends a DELETE request to the specified URI with the provided data.
   *
   * @param uri - The endpoint URI to send the DELETE request to.
   * @param data - The data to be sent in the body of the DELETE request.
   * @param apiUrl - The base URL of the API. Defaults to the value of `import.meta.env.VITE_API_ENDPOINT`.
   * @returns A promise that resolves with the response of the DELETE request.
   */
  static async delete(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    // const decamelizeData = humps.decamelizeKeys(data);
    let requestData = {
      method: 'delete',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    }
    requestData = await _addTokenHeader(requestData)
    return _performRequest(uri, apiUrl, requestData)
  }

  static async put(uri: any, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    //  const decamelizeData = humps.decamelizeKeys(data);
    let requestData = {
      method: 'put',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    }
    requestData = await _addTokenHeader(requestData)
    return _performRequest(uri, apiUrl, requestData)
  }

  /**
   * Promise which performs PATCH Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async patch(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData = {
      method: 'patch',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data,
    }
    requestData = await _addTokenHeader(requestData)
    return _performRequest(uri, apiUrl, requestData)
  }
}
