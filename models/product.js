const mongoose = require("mongoose");
const User = require("./user");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    img: [{
      type: String,
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
  ,
  {
    timestamps: true
  }
);

productSchema.pre("remove", async function(next) {
  try {
    // find a user
    let user = await User.findById(this.user);
    // remove the id of the products from their products list
    user.products.remove(this.id);
    // save that user
    await user.save();
    // return next
    return next();
    
  } catch (err) {
    return next(err);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
