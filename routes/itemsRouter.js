const { Router } = require("express");
const itemsRouter = Router();
const itemsController = require("../controllers/itemsController");

function checkAdmin(req, res, next) {
  const { admin_password } = req.body;

  if (!admin_password || admin_password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).send("Password is incorrect.");
  }

  next();
}

itemsRouter.get("/", itemsController.showAllItems);
itemsRouter.get("/new", itemsController.createForm);
itemsRouter.post("/new", itemsController.createItem);
itemsRouter.get("/low-stock", itemsController.lowStockProducts);
itemsRouter.get("/out-of-stock", itemsController.outofStockProducts);
itemsRouter.get("/expiring", itemsController.expiryingSoonProducts);
itemsRouter.get("/:id/edit", itemsController.editForm);
itemsRouter.get("/:id", itemsController.showItemById);
itemsRouter.post("/:id/update", checkAdmin, itemsController.updateItem);
itemsRouter.post("/:id/delete", checkAdmin, itemsController.deleteItem);

module.exports = itemsRouter;
