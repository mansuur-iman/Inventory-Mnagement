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
    .isFloat({ min: 0 })
    .toFloat()
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
    const products = await db.getAllProductsWithCategory();

    res.render("products/index", {
      title: "All products",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
}

async function showItemById(req, res) {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).send("item not found");
    }

    res.render("products/product", {
      title: "product",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch the product");
  }
}

const createItem = [
  validateItems,
  async (req, res) => {
    const errors = validationResult(req);
    const categories = await db.getAllCategories();

    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.render("products/form", {
        title: "Errors",
        categories,
        product: req.body,
        errors: errors.array(),
        action: "/products/new",
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

    res.redirect("/products");
  },
];

const updateItem = [
  ...validateItems,
  async (req, res) => {
    const errors = validationResult(req);

    const categories = await db.getAllCategories();

    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.render("products/form", {
        title: "Errors",
        categories,
        product: req.body,
        errors: errors.array(),
        action: `/products/${req.params.id}/update`,
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

    res.redirect("/products");
  },
];

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);

    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

const createForm = async (req, res) => {
  const categories = await db.getAllCategories();
  res.render("products/form", {
    title: "New product",
    errors: [],
    product: null,
    categories,
    action: "/products/new",
  });
};

async function editForm(req, res) {
  const { id } = req.params;
  const product = await db.getProductById(id);
  const categories = await db.getAllCategories();

  if (product.expiry_date) {
    product.expiry_date = product.expiry_date.toISOString().split("T")[0];
  }

  res.render("products/form", {
    title: "Edit Product",
    errors: [],
    product,
    categories,
    action: `/products/${id}/update`,
  });
}

async function lowStockProducts(req, res) {
  try {
    const products = await db.lowStockItems();
    res.render("products/index", {
      title: "Low Stock Alerts",
      products,
    });
  } catch (err) {
    res.status(500).send("Error fetching low stock items");
  }
}

async function expiryingSoonProducts(req, res) {
  try {
    const products = await db.expiryingSoonItems();
    res.render("products/index", {
      title: "Expiring Soon",
      products,
    });
  } catch (err) {
    res.status(500).send("Error fetching expiring items");
  }
}

async function outofStockProducts(req, res) {
  try {
    const products = await db.outofStockItems();
    res.render("products/index", {
      title: "Out of Stock",
      products,
    });
  } catch (err) {
    res.status(500).send("Error fetching out of stock items");
  }
}

module.exports = {
  showAllItems,
  showItemById,
  createItem,
  updateItem,
  deleteItem,
  createForm,
  editForm,
  lowStockProducts,
  outofStockProducts,
  expiryingSoonProducts,
};
