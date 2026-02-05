const pool = require("./pool");

async function getAllCategories() {
  const result = await pool.query(
    "SELECT * FROM categories ORDER BY created_at DESC",
  );
  return result.rows;
}

async function getCategoryById(id) {
  const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

async function createCategory(name, description) {
  const result = await pool.query(
    "INSERT INTO categories(name,description) VALUES($1,$2) RETURNING *",
    [name, description],
  );
  return result.rows[0];
}

async function updateCategory(id, name, description) {
  const result = await pool.query(
    "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [id, name, description],
  );
  return result.rows[0];
}

async function deleteCategory(id) {
  const result = await pool.query("DELETE FROM categories WHERE id =$1", [id]);
  return result.rowCount;
}

async function getAllProducts() {
  const result = await pool.query(
    "SELECT * FROM items ORDER BY created_at DESC",
  );
  return result.rows;
}

async function getProductById(id) {
  const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
  return result.rows[0];
}

async function addProduct(
  name,
  description,
  category_id,
  quantity,
  price,
  expiry_date,
) {
  const result = await pool.query(
    "INSERT INTO items(name,description,category_id,quantity,price,expiry_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
    [name, description, category_id, quantity, price, expiry_date],
  );
  return result.rows[0];
}

async function updateProduct(
  id,
  name,
  description,
  category_id,
  quantity,
  price,
  expiry_date,
) {
  const result = await pool.query(
    "UPDATE items SET name = $2, description = $3, category_id = $4, quantity = $5, price = $6, expiry_date = $7 WHERE id = $1 RETURNING *",
    [id, name, description, category_id, quantity, price, expiry_date],
  );
  return result.rows[0];
}

async function deleteProduct(id) {
  const result = await pool.query("DELETE FROM items WHERE id = $1", [id]);
  return result.rowCount;
}

async function outofStockItems() {
  const result = await pool.query("SELECT * FROM items WHERE quantity = 0");
  return result.rows;
}

async function lowStockItems() {
  const result = await pool.query("SELECT * FROM items where quantity < 5");
  return result.rows;
}

async function expiryingSoonItems() {
  const result = await pool.query(
    `SELECT * FROM items WHERE expiry_date IS NOT NULL AND expiry_date<= CURRENT_DATE + INTERVAL '7 days'`,
  );
  return result.rows;
}

async function getAllProductsWithCategory() {
  const result = await pool.query(
    "SELECT items.id AS item_id,items.name AS item_name,items.description AS item_description,items.quantity,items.price,items.created_at,items.expiry_date,categories.id AS category_id,categories.name AS category_name,categories.description AS category_description FROM items LEFT JOIN categories IN items.category_id = categories.id ORDER BY items.created_at DESC",
  );
  return result.rows;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  outofStockItems,
  lowStockItems,
  expiryingSoonItems,
  getAllProductsWithCategory,
};
