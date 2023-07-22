import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function createCustomer(data) {
  return await Api(`customers/create`, data, "post", null);
}

export async function getCustomers() {
  return await Api(`customers/`, null, "get", null);
}

export async function getCustomerFromId(customerId) {
  return await Api(`customers/${customerId}`, null, "get", null);
}
