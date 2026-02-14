require("dotenv").config();

const express = require("express");
const app = express();

const itemsRouter = require("./routes/itemsRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const specialRouter = require("./routes/specialRouter");

const path = require("node:path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/", specialRouter);
app.use("/products", itemsRouter);
app.use("/categories", categoriesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`running the server on PORT: ${PORT}`);
});
