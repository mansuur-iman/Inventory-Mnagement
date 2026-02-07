const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const lengthErr = "Must be between 1 and 30 characters";
const validateItems = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("item name is required")
    .isLength({ min: 1, max: 30 })
    .withMessage(`item name ${lengthErr}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("item description is required.")
    .isLength({ min: 10 })
    .withMessage("Description must be atleast 10 characters."),
  body("quantity")
    .notEmpty()
    .withMessage("item quantity is required.")
    .isInt({ min: 0 })
    .withMessage("inavlid quantity."),
  body("price")
    .notEmpty()
    .withMessage("item price is required.")
    .isInt({ min: 0 })
    .withMessage("invalid price."),
  body("category_id")
    .notEmpty()
    .withMessage("category ID is required.")
    .isInt()
    .withMessage("invalid category"),
  body("expiry_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("invalid expiry date."),
];

async function showAllItems(req, res) {
  try {
    const items = await db.getAllProducts();

    res.render("products", {
      title: "All items",
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
}

async function showItemById(req, res) {
  try {
    const { id } = req.params;
    const item = await db.getProductById(id);

    if (!item) {
      return res.status(404).send("item not found");
    }

    res.render("products", {
      title: "item",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch the item");
  }
}

const createItem = [
  ...validateItems,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.render("/item", {
        title: "Errors",
        errors: errors.array(),
      });
    }

    const data = matchedData(req);
    await db.addProduct(
      data.name,
      data.description,
      data.category_id,
      data.quantity,
      data.price,
      data.expiry_date,
    );

    res.redirect("items");
  },
];

const updateItem = [
  ...validateItems,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.render("/item", {
        title: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const data = matchedData(req);

    await db.updateProduct(
      id,
      data.name,
      data.description,
      data.category_id,
      data.quantity,
      data.price,
      data.expiry_date,
    );

    res.redirect("items");
  },
];

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);

    res.redirect("/item");
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
}

module.exports = {
  showAllItems,
  showItemById,
  createItem,
  updateItem,
  deleteItem,
};
