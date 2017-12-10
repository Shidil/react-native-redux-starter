import { CALL_API } from "redux-api-middleware";
import flat from "flat";

const methods = {
  GET: "GET",
  POST: "POST",
  FILE: "POSTFILE",
  DELETE: "DELETE",
  PUT: "PUT",
};

const convertObjectToQueryParams = (params) => {
  const flattened = flat(params, { safe: true });
  const flattenedParams = Object.keys(flattened)
    .reduce((prev, key) => {
      const curr = flattened[key];
      if (!curr) {
        return prev;
      } else if (Array.isArray(curr)) {
        return prev.concat(curr.map(item => ({ key, value: item })));
      }
      prev.push({ key, value: curr });
      return prev;
    }, []);
  const result = flattenedParams
    .map(item => item ? (`${encodeURIComponent(item.key)}=${encodeURIComponent(item.value)}`) : "").join("&");
  return result;
};

const appendQueryParams = (url, params) => {
  // checking to see need of transofrmation
  if (params && typeof params === "object") {
    return url + (url.indexOf("?") === -1 ? "?" : "&") + convertObjectToQueryParams(params);
  }

  return url;
};

/**
 * Transforms url for different methods
 * @param {String} method method of request
 * @param {String} url pure url
 * @param {*} params request params, not transformed
 * @returns {String} transoformed url
 */
const transformUrl = (method, url, params) => {
  if (method === methods.GET) {
    return appendQueryParams(url, params);
  }

  if (method === methods.DELETE && typeof params === "string") {
    return `${url}/${params}`;
  }

  return url;
};

/**
 * Generates client function from method name
 * @param {String} method method name
 * @returns {Function} to be exported
 */
const buildClient = (method) => {
  return (url, params, actions, meta) => {
    const endpoint = transformUrl(method, url, params);
    const requestType = (actions.length === 3) ? actions.shift() : "REQUEST";
    const successType = actions[0];
    const failureType = actions[1];

    // Fired when api resource is called
    const requestAction = {
      type: requestType,
      meta,
    };

    // fired when request fails
    const failureAction = {
      type: failureType,
      meta,
    };

    // fired when request completes with status 200
    const successAction = {
      meta,
      type: successType,
      payload: (action, state, res) => {
        console.log(action, state);
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.indexOf("json") >= 0) {
          // Just making sure res.json() does not raise an error
          return res.json().then(json => {
            // check if request is a failure
            if (json.success === false) {
              throw new Error(json.error.message);
            }

            return json;
          });
        }

        return undefined;
      },
    };

    return (dispatch) => {
      // const { session } = getState().app;
      const request = {
        endpoint,
        method,
        credentials: "same-origin",
        types: [requestAction, successAction, failureAction],
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: undefined,
      };

      // POST and PUT is sent as json
      if (method === methods.POST || method === methods.PUT) {
        request.body = JSON.stringify(params);
      }

      if (method === methods.DELETE && typeof params === "object") {
        request.body = JSON.stringify(params);
      }

      console.log(request);

      dispatch({
        [CALL_API]: request,
      });
    };
  };
};

export const POST = buildClient(methods.POST);
export const GET = buildClient(methods.GET);
export const PUT = buildClient(methods.PUT);
export const DELETE = buildClient(methods.DELETE);
export const POSTFILE = buildClient(methods.FILE);
