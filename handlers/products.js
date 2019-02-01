const db = require("../models");

exports.createProduct = async function(req, res, next) {
  try {
    let product = await db.Product.create({
      title: req.body.title,
      text: req.body.text,
      price: req.body.price,
      img: req.body.img,
      user: req.params.id
    });
    let foundUser = await db.User.findById(req.params.id);
    foundUser.products.push(product.id);
    await foundUser.save();
    
    let foundProduct = await db.Product.findById(product._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundProduct);
  } catch (err) {
    return next(err);
  }
};


// EDIT /api/users/:id/products/:product_id
exports.updateProduct =  async function(req, res, next){
  try{
    let product = await db.Product.findOneAndUpdate({_id: req.params.product_id}, req.body, {new: true})

    // let foundUser = await db.User.findById(req.params.id);

    // foundUser.products.push(product.id);

    // await foundUser.save();

    let foundProduct = await db.Product.findById(product._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundProduct);
  } catch (err) {
    return next(err);
  }
}



// GET - /api/users/:id/products/:product_id
exports.getProduct = async function(req, res, next) {
  try {
    let product = await db.Product.findById(req.params.product_id);
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};



// DELETE /api/users/:id/products/:product_id
exports.deleteProduct = async function(req, res, next) {
  try {
    let foundProduct = await db.Product.findById(req.params.product_id);
    await foundProduct.remove();

    return res.status(200).json(foundProduct);
  } catch (err) {
    return next(err);
  }
};
