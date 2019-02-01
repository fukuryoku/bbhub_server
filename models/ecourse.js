const mongoose = require("mongoose");
const User = require("./user");

const ecourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    langfrom: {
      type: String,
      required: true,
    },
    langto: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },

    lessons:[
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson"
      }
  ],

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

ecourseSchema.pre("remove", async function(next) {
  try {
    // find a user
    let user = await User.findById(this.user);
    // remove the id of the ecourses from their ecourses list
    user.ecourses.remove(this.id);
    // save that user
    await user.save();
    // return next
    return next();
    
  } catch (err) {
    return next(err);
  }
});

const Ecourse = mongoose.model("Ecourse", ecourseSchema);
module.exports = Ecourse;
