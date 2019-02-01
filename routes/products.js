const express = require("express");
const router = express.Router({ mergeParams: true });

const {createProduct, getProduct, deleteProduct, updateProduct} = require("../handlers/products");

// prefix - /api/users/:id/products
router.route("/").post(createProduct);

// prefix - /api/users/:id/products/:products_id
router
  .route("/:product_id")
  .get(getProduct)
  .delete(deleteProduct)
  .put(updateProduct);

module.exports = router;
