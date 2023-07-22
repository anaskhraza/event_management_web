import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function createProducts(data) {
  return await Api(`products/create`, data, "post", null);
}

export async function getAllProducts() {
  return await Api(`products/`, null, "get", null);
}

export async function deleteProducts(productId) {
  return await Api(
    `products/delete?productId=${productId}`,
    null,
    "delete",
    null
  );
}
