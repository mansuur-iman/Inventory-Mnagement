const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "Must contain only letters";
const lengthErr = "Must be between 1 and 30 characters";

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("category name is required")
    .bail()
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage(`category name ${lengthErr}`),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("category description is required")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Description must be atleat 5 characters."),
];

async function showAllCategories(req, res) {
  try {
    const categories = await db.getAllCategories();
    res.render("categories/index", {
      title: "All categories",
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch categories");
  }
}

async function showCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await db.getCategoryById(id);

    res.render("categories/product", {
      title: "category",
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt fetch category");
  }
}

function showForm(req, res) {
  res.render("categories/form", {
    title: "New category",
    category: null,
    errors: [],
    action: "/categories/new",
  });
}

async function editForm(req, res) {
  const { id } = req.params;
  const category = await db.getCategoryById(id);

  res.render("categories/form", {
    title: "Edit Category",
    category,
    errors: [],
    action: `/categories/${id}/update`,
  });
}

const insertIntoCategories = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("categories/form", {
        title: "New Category",
        category: {
          name: req.body.name,
          description: req.body.description,
        },
        errors: errors.array(),
        action: "/categories/new",
      });
    }

    const data = matchedData(req);
    await db.createCategory(data.name, data.description);
    res.redirect("/categories");
  },
];

async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("couldnt delete category");
  }
}

const updateTheCategory = [
  validateCategory,
  async (req, res) => {
    const { id } = req.params; // get id here first
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("categories/form", {
        title: "Edit Category",
        category: {
          id: id,
          name: req.body.name,
          description: req.body.description,
        },
        errors: errors.array(),
        action: `/categories/${id}/update`,
      });
    }

    const data = matchedData(req);
    await db.updateCategory(id, data.name, data.description);

    res.redirect("/categories");
  },
];

module.exports = {
  showAllCategories,
  showCategoryById,
  updateTheCategory,
  insertIntoCategories,
  deleteCategoryById,
  showForm,
  editForm,
};
