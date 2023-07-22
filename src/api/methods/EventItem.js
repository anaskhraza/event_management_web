import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function getEventItemsForOrders(data) {
  return await Api(`products/dates`, data, "post", null);
}

export async function getEventItemsQuantityForOrders(data) {
  return await Api(`products/bookingProducts`, data, "post", null);
}

export async function createEventItems(data) {
  return await Api(`products/createBookingProducts`, data, "post", null);
}

export async function deleteEventItems(orderId) {
  return await Api(
    `products/deleteBookingProducts?orderId=${orderId}`,
    null,
    "delete",
    null
  );
}

export async function fetchOrderedItems() {
  return await Api(`products/orders`, null, "get", null);
}

export async function fetchItemByOrderId(orderId) {
  return await Api(`products/orders/${orderId}`, null, "get", null);
}

export async function createDraftItems(data) {
  return await Api(`products/createDraftProducts`, data, "post", null);
}

export async function deleteDraftItems(draftId) {
  return await Api(
    `products/deleteDraftProducts?draftId=${draftId}`,
    null,
    "delete",
    null
  );
}

export async function fetchItemByDraftId(draftId) {
  return await Api(`products/drafts/${draftId}`, null, "get", null);
}
