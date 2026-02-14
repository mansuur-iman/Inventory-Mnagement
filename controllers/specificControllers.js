const db = require("../db/queries");

const { query, validationResult } = require("express-validator");

const validateSearch = [
  query("name")
    .trim()
    .notEmpty()
    .withMessage("Search query cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Search query is too long"),
];

async function getProductWithItsCategory(req, res) {
  try {
    const result = await db.getAllProductsWithCategory();
    res.render("home", {
      title: "Inventory Dashboard",
      result: result,
    });
  } catch (err) {
    console.error("Database fetch error:", err);
    res.status(500).send("Error fetching dashboard data");
  }
}
const searchTheProduct = [
  ...validateSearch,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.error(errors.array());
        return res.render("search", {
          title: "Search result",
          searchedProduct: [],
          message: errors
            .array()
            .map((e) => e.msg)
            .join(", "),
        });
      }

      const { name } = req.query;

      const searchedProduct = await db.searchProduct(name);

      if (searchedProduct.length === 0) {
        return res.render("search", {
          title: "Search result",
          searchedProduct: [],
          message: "Product not found",
        });
      }

      res.render("search", {
        title: "Searched result",
        searchedProduct,
        message: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error while searching product");
    }
  },
];

module.exports = {
  getProductWithItsCategory,
  searchTheProduct,
};
