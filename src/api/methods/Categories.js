import Api from "../index";
import ApiConstants from "../ApiConstants";

export async function createCategory(data) {
  return await Api(`category/create`, data, "post", null);
}

export async function getAllCategories(data) {
  return await Api(`category/`, null, "get", null);
}

export async function deleteCategory(categoryId) {
  return await Api(
    `category/delete?categoryId=${categoryId}`,
    null,
    "delete",
    null
  );
}
