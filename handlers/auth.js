const db = require("../models");
const async = require('async');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


exports.signin = async function(req, res, next) {
  // finding a user
  try {
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, profileImageUrl, progress } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
          profileImageUrl,
          progress
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token,
        progress
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password."
      });
    }
  } catch (e) {
    return next({ status: 400, message: "Invalid Email/Password." });
  }
};

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create(req.body);
    let { id, username, profileImageUrl, progress } = user;
    let token = jwt.sign(
      {
        id,
        username,
        profileImageUrl,
        progress
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token,
      progress
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = " Имя пользователя или почта уже заняты";
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};


exports.forgot = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.body.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function(user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
        done(err, token, new_user);
      });
    },
    function(token, user, done) {

      var mailOptions = {
        to: user.email,
        from: 'BBHUB.CC',
        subject: 'BBHUB, восстановление пароля',
        text: 'Вы получили это письмо тк Вы пытаетесь восстановить пароль к Вашему аккаунту в магазине чая HIBIKI.\n\n' +
          'Перейдите по ссылке для восстановления пароля:\n\n' +
          'http://bbhub.cc/reset/' + token + '\n\n' +
          // 'http://' + req.headers.host + '/reset/' + token + '\n\n' +

          'Если Вы не продолжите смену пароля, Ваш пароль останется прежним.\n'};
      

      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          return res.json({ message: 'Инструкции по сбросу пароля были отправлены вам на почту' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
};


exports.reset = function(req, res, next) {
  db.User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec( function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.password = req.body.newPassword;
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail', 
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
                          }
            });
            var mailOptions = {
              to: user.email,
              from: 'BBHUB.CC',
              subject: 'Ваш пароль был изменен',
              text: 'Hello,\n\n' +
                'Отлично, Ваш пароль изменён! ' + user.email + ' новый пароль: '+ user.password +'.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              done(err);
            });
            console.log('done')
          }
        });
      } else {
        return res.status(422).send({
          message: 'Пароли не совпадают'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Ссылка восстановления недействительна или просрочена'
      });
    }
  });
};