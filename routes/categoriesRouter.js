const { Router } = require("express");
const categoriesRouter = Router();

const categoriesController = require("../controllers/appController");

function checkAdmin(req, res, next) {
  const { admin_password } = req.body;

  if (!admin_password || admin_password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Password is incorrect.");
  }

  next();
}

categoriesRouter.get("/", categoriesController.showAllCategories);
categoriesRouter.get("/new", categoriesController.showForm);
categoriesRouter.post("/new", categoriesController.insertIntoCategories);
categoriesRouter.get("/:id", categoriesController.showCategoryById);
categoriesRouter.get("/:id/edit", categoriesController.editForm);
categoriesRouter.post(
  "/:id/update",
  checkAdmin,
  categoriesController.updateTheCategory,
);
categoriesRouter.post(
  "/:id/delete",
  checkAdmin,
  categoriesController.deleteCategoryById,
);

module.exports = categoriesRouter;
