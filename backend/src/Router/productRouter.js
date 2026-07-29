const express = require('express');
const productRouter = express.Router();
const { getProducts, filterProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } = require('../Controller/productController');
const auth = require('../Middleware/authMiddleware');

productRouter.get("/", auth ,getProducts);
productRouter.get("/filter", auth ,filterProducts);
productRouter.post("/", auth ,createProduct);
productRouter.put("/:id", auth ,updateProduct);
productRouter.delete("/:id", auth, deleteProduct);
productRouter.patch("/:id/toggle-status", auth, toggleProductStatus);

module.exports = productRouter;
