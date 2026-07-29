const express = require('express');
const productRouter = express.Router();
const { getProducts, filterProducts, createProduct, updateProduct, deleteProduct } = require('../Controller/productController');

productRouter.get("/", getProducts);
productRouter.get("/filter", filterProducts);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
