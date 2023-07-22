import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function createTarget(data, token) {
  //console.log("createTarget token => ", token);
  return await Api(`targets/create`, data, "post", token);
}

export async function getAllTargets(year, token) {
  return await Api(`targets/year/${year}`, null, "get", token);
}

export async function deleteTarget(targetId, token) {
  return await Api(
    `targets/delete?targetId=${targetId}`,
    null,
    "delete",
    token
  );
}

export async function signIn(data) {
  return await Api(`users/signIn`, data, "post", null);
}

export async function backup() {
  return await Api(`backups/`, null, "get", null);
}
