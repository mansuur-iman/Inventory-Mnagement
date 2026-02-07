const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "Must contain only letters";
const lengthErr = "Must be between 1 and 30 characters";

const validateCategory = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage(`category name ${alphaErr}`)
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 1, max: 30 })
    .withMessage(`category name ${lengthErr}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("category description is required")
    .isLength({ min: 5 })
    .withMessage("Description must be atleat 5 characters."),
];

async function showAllCategories(req, res) {
  try {
    const categories = await db.getAllCategories();
    res.render("categories", {
      title: "All categories",
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch categories");
  }
}

async function showCategoryById(re, res) {
  try {
    const { id } = req.params;
    const category = await db.getCategoryById(id);

    res.render("category", {
      title: "category",
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch category");
  }
}

async function showForm(req, res) {
  res.render("form", {
    title: "Inventory Form",
    errors: [],
  });
}

const insertIntoCategories = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("form", {
        title: "errors",
        errors: errors.array(),
      });
    }

    const data = matchedData(req);
    await db.createCategory(data.name, data.description);
    re.redirect("/");
  },
];

async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt delete category");
  }
}

const updateTheCategory = [
  validateCategory,
  async (re, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("form", {
        title: "errors",
        errors: errors.array(),
      });
    }

    const data = matchedData(req);
    const { id } = req.params;
    await db.updateCategory(id, data.name, data.description);

    res.redirect("/");
  },
];

module.exports = {
  showAllCategories,
  showCategoryById,
  updateTheCategory,
  insertIntoCategories,
  deleteCategoryById,
  showForm,
};
