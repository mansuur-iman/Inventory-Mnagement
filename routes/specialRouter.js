const { Router } = require("express");
const specialRouter = Router();

const specificControllers = require("../controllers/specificControllers");

specialRouter.get("/", specificControllers.getProductWithItsCategory);
specialRouter.get("/search", specificControllers.searchTheProduct);

module.exports = specialRouter;
