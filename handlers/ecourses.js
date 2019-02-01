const db = require("../models");


// POST /api/users/:id/ecourses/

exports.createEcourse = async function(req, res, next) {
  try {
    let ecourse = await db.Ecourse.create({
      title: req.body.title,
      langfrom: req.body.langfrom,
      langto: req.body.langto,
      text: req.body.text,
      level: req.body.level,
      img: req.body.img,
      user: req.params.id
    });
    let foundUser = await db.User.findById(req.params.id);
    foundUser.ecourses.push(ecourse.id);
    await foundUser.save();
    
    let foundEcourse = await db.Ecourse.findById(ecourse._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundEcourse);
  } catch (err) {
    return next(err);
  }
};
// GET ALL MY/api/users/:id/ecourses/
exports.getMyEcourses = async function(req, res, next) {
  try {
    let ecourses = await db.Ecourse.find({"user": {"_id":req.params.id}});

    return res.status(200).json(ecourses);
  } catch (err) {
    return next(err);
  }
};

// GET ONE MY- /api/users/:id/ecourses/:ecourse_id
exports.getEcourse = async function(req, res, next) {
  try {
    let ecourse = await db.Ecourse.findById(req.params.ecourse_id);
    return res.status(200).json(ecourse);
  } catch (err) {
    return next(err);
  }
};

// EDIT /api/users/:id/ecourses/:ecourse_id
exports.updateEcourse =  async function(req, res, next){
  try{
    let ecourse = await db.Ecourse.findOneAndUpdate({_id: req.params.ecourse_id}, req.body, {new: true})

    // let foundUser = await db.User.findById(req.params.id);

    // foundUser.ecourses.push(ecourse.id);

    // await foundUser.save();

    let foundEcourse = await db.Ecourse.findById(ecourse._id).populate("user", {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundEcourse);
  } catch (err) {
    return next(err);
  }
}






// DELETE /api/users/:id/products/:ecourse_id
exports.deleteEcourse = async function(req, res, next) {
  try {
    let foundEcourse = await db.Ecourse.findById(req.params.ecourse_id);
    await foundEcourse.remove();

    return res.status(200).json(foundEcourse);
  } catch (err) {
    return next(err);
  }
};
