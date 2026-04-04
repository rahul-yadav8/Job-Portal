import { triggerDownload } from "@/utils/url";

/**
 * Clears all data from local storage and removes all cookies.
 *
 * This function performs the following actions:
 * 1. Clears all key-value pairs from the browser's local storage.
 * 2. Retrieves all cookies and splits them into individual key-value pairs.
 * 3. Iterates through each cookie and sets its expiration date to a past date, effectively removing it.
 */
export const clearStorage = () => {
  localStorage.clear();
  var res = document.cookie;
  var multiple = res.split(";");
  for (var i = 0; i < multiple.length; i++) {
    var key = multiple[i].split("=");
    document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
  }
};

/**
 * Handles the headers of a fetch response.
 *
 * @param response - The response object returned from a fetch call.
 * @returns A promise that resolves with the response object if it exists, otherwise it rejects with an error.
 */
export const handleHeaders = (response: any) =>
  new Promise(async (resolve, reject) => {
    // Check if the response header has Content-Disposition
    if (response.headers.get('Content-Disposition')) {
      const blob = new Blob([response.data], { type: 'text/csv' })
      // const filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');
      triggerDownload(blob, `notification-logs-${new Date().toISOString()}.csv`);
      resolve(response);
    }
    if (!response) {
      reject(new Error("No response returned from fetch."));
    }
    resolve(response);
  });


/**
 * Handles errors from a fetch response.
 *
 * @param {any} response - The response object from a fetch request.
 * @returns {Promise<any>} A promise that resolves if the response is successful, or rejects with an error object if the response indicates an error.
 *
 * The function performs the following checks:
 * - If the response is not provided, it rejects with an error indicating no response was returned.
 * - If the response is successful (status is ok or 204), it resolves the promise.
 * - If the response status is 401, it clears storage and redirects to the login page if not already there, otherwise rejects with an invalid login credentials error.
 * - For other error statuses, it attempts to parse the response as JSON and rejects with an appropriate error message based on the status code.
 * - If the response cannot be parsed as JSON, it rejects with a 500 status and a "Response not JSON" message.
 *
 * Error statuses handled:
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 409: Conflict
 * - 422: Unprocessable Entity
 * - 500: Internal Server Error
 * - 501: Not Implemented
 * - 503: Service Unavailable
 */
export const handleErrors = ({ response }: any) =>
  new Promise((_, reject) => {

    if (!response) {
      reject(new Error('No response returned from fetch.'));
      return;
    }
    if (response.status === 401) {
      clearStorage();
      if (window.location.pathname !== '/login') {
        window.location = '/login' as any;
      } else {
        reject({
          status: 401,
          message: 'Invalid Login Credentials'
        });
      }
    }
    const { data, status } = response;
    console.log("Error Handle Error Response Data - ", data)
    console.log("Error Handle Error Message - ", data?.messages)
    switch (status) {
      case 400:
        return reject({
          status: data?.status,
          message: data?.messages,
          detail: data?.detail
        });

      // case 400:
      //   if (Array.isArray(json.message)) {
      //     return reject({
      //       status: 400,
      //       message: Array.isArray(json.message[0].error) ? json.message[0].error[0] : json.message[0].error
      //     });
      //   } else {
      //     return reject({
      //       status: 400,
      //       message: json.message
      //     });
      //   }

      case 404:
        reject({
          status: 404,
          message: data?.messages
        });
        break;
      case 403:
        return reject({
          status: 404,
          message: data?.message
        });
      case 409:
        return reject({
          status: response.status,
          message: data?.message || ''
        });
      case 503:
      case 500:
      case 501:
        return reject({
          status: response.status,
          message: 'Internal Server Error.'
        });
      default:
        return reject({
          status: null,
          message: response.statusText
        });
    }
    // response
    //   .json()
    //   .then((json: any) => {

    //   })
    //   .catch(() => {
    //     reject({
    //       status: 500,
    //       message: 'Response not JSON'
    //     });
    //   });
  });

/**
 * Extracts the JSON body from a response object.
 *
 * @param response - The response object to extract the body from.
 * @returns A promise that resolves to the JSON body of the response, or resolves to undefined if the response status is 204 (No Content).
 */
export const getResponseBody = (response: any) => {
  const bodyIsEmpty = response.status === 204;
  if (bodyIsEmpty) {
    return Promise.resolve();
  }
  return response
};
