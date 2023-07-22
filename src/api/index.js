import ApiConstants from "./ApiConstants";
export default function api(path, params, method, token, customURL) {
  let URL = ApiConstants.BASE_URL + path;
  if (customURL) {
    URL = customURL;
  }

  let options;
  options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: token })
    },
    method: method,
    ...(params && { body: JSON.stringify(params) })
  };
  let status = null;
  return fetch(URL, options)
    .then(resp => {
      status = resp.status;
      return resp.json();
    })
    .then(json => {
      return { body: json, status: status };
    })
    .catch(error => {
      //console.log("ERROR =>>> " + error);
      if (error == "SyntaxError: Unexpected token U in JSON at position 0") {
        error = "Unauthorized";
      }
      return { error: error, status: 404 };
    });
}
