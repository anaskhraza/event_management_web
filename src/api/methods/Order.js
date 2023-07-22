import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function createOrder(data) {
  return await Api(`orders/create`, data, "post", null);
}

export async function deleteOrder(orderId) {
  return await Api(`orders/order?orderId=${orderId}`, null, "delete", null);
}

export async function getOrdersList() {
  return await Api(`orders/`, null, "get", null);
}

export async function getArgOrdersList(url) {
  return await Api(`orders/${url}`, null, "get", null);
}

export async function updateOrder(orderId, data) {
  return await Api(`orders/${orderId}`, data, "put", null);
}

export async function closedOrderByYear(year, token) {
  return await Api(`orders/years/${year}`, null, "get", token);
}

export async function closedOrderStats(token) {
  return await Api(`orders/closedStats`, null, "get", token);
}

export async function nonClosedOrderStats(token) {
  return await Api(`orders/nonClosedStats`, null, "get", token);
}

export async function overDueOrderStats(token) {
  return await Api(`orders/overdueStats`, null, "get", token);
}

export async function closedOrder() {
  return await Api(`orders/closed`, null, "get");
}

export async function voidOrder() {
  return await Api(`orders/void`, null, "get");
}

export async function overDueOrder() {
  return await Api(`orders/overdue`, null, "get");
}

export async function completedOrder() {
  return await Api(`orders/completed`, null, "get");
}

export async function voidOrderMonth() {
  return await Api(`orders/void?currentMonth=true`, null, "get", null);
}

export async function getOrdersListMonth() {
  return await Api(`orders/?currentMonth=true`, null, "get", null);
}

export async function closedOrderMonth() {
  return await Api(`orders/closed?currentMonth=true`, null, "get");
}

export async function overDueOrderMonth() {
  return await Api(`orders/overdue?currentMonth=true`, null, "get");
}

export async function completedOrderMonth() {
  return await Api(`orders/completed?currentMonth=true`, null, "get");
}

export async function completedCloseOrderMonth() {
  return await Api(`orders/completed?closeComOrd=true`, null, "get");
}

export async function getUpcomingOrdersList() {
  return await Api(`orders/upcoming`, null, "get", null);
}

export async function updateBulkOrders(data) {
  return await Api(`orders/createBulkOrders`, data, "post", null);
}

export async function printOrder(data) {
  return await Api(`prints/print`, data, "post", null);
}