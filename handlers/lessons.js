const db = require("../models");


// POST /api/users/:id/ecourses/:ecourse_id/lessons/

exports.createLesson = async function(req, res, next) {
  try {
    let lesson = await db.Lesson.create({
      title: req.body.title,
      order: req.body.order,
      text: req.body.text,
      video: req.body.video,
      img: req.body.img,
      quizz:{question: req.body.question,
            options: req.body.options,
            answer: req.body.answer},
      ecourse: req.params.ecourse_id,
      user: req.params.id
    });

    let foundEcourse = await db.Ecourse.findById(req.params.ecourse_id);

    foundEcourse.lessons.push(lesson.id);
      // foundEcourse.lessons.splice(lesson.order, 0, lesson.id);

    await foundEcourse.save();

    let foundLesson = await db.Lesson.findById(lesson._id).populate("ecourse", {
      title: true,
      langto: true,
      level:true
    });
    return res.status(200).json(foundLesson);
  } catch (err) {
    return next(err);
  }
};

// GET ONE MY- /api/users/:id/ecourse/:ecourse_id/lessons/:lesson_id
exports.getLesson = async function(req, res, next) {
  try {
    let lesson = await db.Lesson.findById(req.params.lesson_id);
    return res.status(200).json(lesson);
  } catch (err) {
    return next(err);
  }
};

// GET ALL MY/api/users/:id/ecourse/:ecourse_id/lessons !!!!!!!!!!!!!!!!!
exports.getMyLessons = async function(req, res, next) {
  try {
    let lessons = await db.Lesson.find({"user": {"_id":req.params.id}, "ecourse": {"_id":req.params.ecourse_id}});

    return res.status(200).json(lessons);
  } catch (err) {
    return next(err);
  }
};



// EDIT /api/users/:id/ecourses/:ecourse_id/lessons/:lesson_id
exports.updateLesson =  async function(req, res, next){
  try{
    let updatedLesson = await {
      title: req.body.title,
      text: req.body.text,
      video: req.body.video,
      img: req.body.img,
      quizz:{question: req.body.question,
            options: req.body.options,
            answer: req.body.answer},
      ecourse: req.params.ecourse_id,
      user: req.params.id
    };

    let lesson = await db.Lesson.findOneAndUpdate({_id: req.params.lesson_id}, updatedLesson, {new: true})

    // let foundEcourse = await db.Ecourse.findById(req.params.ecourse_id);

    // foundEcourse.lessons.push(lesson.id);

    // await foundEcourse.save();

    let foundLesson = await db.Lesson.findById(lesson._id).populate("ecourse", {
      title: true,
      langto: true,
      level:true
    });
    return res.status(200).json(foundLesson);
  } catch (err) {
    return next(err);
  }
}





// DELETE /api/users/:id/ecourses/:ecourse_id/lessons/:lesson_id
exports.deleteLesson = async function(req, res, next) {
  try {
    let foundLesson = await db.Lesson.findById(req.params.lesson_id);
    await foundLesson.remove();
    return res.status(200).json(foundLesson);
  } catch (err) {
    return next(err);
  }
};
