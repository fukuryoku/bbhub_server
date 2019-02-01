const db = require("../models");


// UODATE USER PUT- /api/users/:id
      

exports.updateUser =  async function(req, res, next){
    try{
      let updateUser = await {
        email: req.body.email,
        username: req.body.username,
        profileImageUrl: req.body.profileImageUrl,
      };
  
      let user = await db.User.findOneAndUpdate({_id: req.params.id}, updateUser, {new: true})
      let { id, token, username, profileImageUrl, email, progress } = user;
      return res.status(200).json({
        id,
        token,
        username,
        profileImageUrl,
        email,
        progress
      });
    } catch (err) {
      return next(err);
    }
  }

  
  // UPDATE USERs progress PUT - /api/profile/:id/progress

  exports.upateUsersProgress = async function(req, res, next) {
    try {
      let newProgress = req.body.progress
    
      let foundUser = await db.User.findById(req.params.id);
      foundUser.progress.push(newProgress);
      await foundUser.save();
      let { id, username, progress, email, profileImageUrl } = foundUser;
      return res.status(200).json({
        id,
        username,
        progress,
        email, 
        profileImageUrl
      });
    } catch (err) {
      return next(err);
    }
  };

//get

