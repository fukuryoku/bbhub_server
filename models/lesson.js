const mongoose = require("mongoose");
const Ecourse = require("./ecourse");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },

    video: {
      type: String,
    },

    img: [{
      type: String,
    }],

    quizz:{
      question: {
        type: String,
      },
      options:[{
        type: String,
      }],
      
      answer:{
        type: String,
      }
    },

      user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
      ecourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ecourse"
    }

  }
  ,
  {
    timestamps: true
  }
);

lessonSchema.pre("remove", async function(next) {
  try {
    // find a ecourse
    let ecourse = await Ecourse.findById(this.ecourse);
    // remove the id of the lessons from ecourse products list
    ecourse.lessons.remove(this.id);
    // save that ecourse
    await ecourse.save();
    // return next
    return next();
    
  } catch (err) {
    return next(err);
  }
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
