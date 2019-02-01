require("dotenv").config();
const express       = require('express');
const app           = express();
const cors          = require("cors");
const bodyParser    = require("body-parser");
const errorHandler  = require("./handlers/error")
const nodemailer = require("nodemailer");
const helmet = require('helmet')
const authRoutes    = require ("./routes/auth")

const profileRoutes    = require ("./routes/users")

const productRoutes = require ('./routes/products')
const ecoursesRoutes = require ('./routes/ecourses')
const lessonsRoutes = require ('./routes/lessons')
const {loginRequired, ensureCorrectUser, isAdmin} = require("./middleware/auth")
const db = require("./models");

const PORT = process.env.PORT || 8081;
// const PORT = process.env.PORT;


app.use(cors())
app.use(bodyParser.json())
app.use(helmet())

app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes, loginRequired, ensureCorrectUser,)
app.use('/api/users/:id/products', loginRequired, ensureCorrectUser, isAdmin, productRoutes)
app.use('/api/users/:id/ecourses', loginRequired, ensureCorrectUser, ecoursesRoutes)
app.use('/api/users/:id/ecourses/:ecourse_id/lessons', loginRequired, ensureCorrectUser, lessonsRoutes)

// =========================Prods GET ALL=============================
app.get("/api/products", async function(req, res, next){
    try{
        let products = await db.Product.find()
        .populate("user",{
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(products);
    }catch(err){
        return next(err)
    }
})
// =========================ECOURSE GET ALL ROUTES=========================
app.get("/api/ecourses", async function(req, res, next){
    try{
        let ecourses = await db.Ecourse.find()
        .populate("user",{
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(ecourses);
    }catch(err){
        return next(err)
    }
})


//============================LESSONS GET ALL ROUTE======================================== 

app.get("/api/ecourses/:ecourse_id/lessons", async function(req, res, next){
    try{
        let lessons = await db.Lesson.find({"ecourse": {"_id":req.params.ecourse_id}})
        .sort({ order: 1 })
        .populate("user",{
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(lessons);
    }catch(err){
        return next(err)
    }
})

app.post('/contactform', function (req, res) {
    

    var smtpTransport = nodemailer.createTransport({
       service: "Gmail", 
       auth: {
       user: 'Hibiki.Tea.Store@gmail.com',
       pass: 'hb_FLY_100%'
       }});

    var maillist = [
      'v.lokaichuk@gmail.com'
    ];


   smtpTransport.sendMail({  //email options
   from: "BB HUB",
   to: maillist, 
   subject: "ФОРМА САЙТА", // subject
   html:  `<html>
            <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css?family=Nunito:200i,400,600,700" rel="stylesheet">

            </head>
            <body style="color: #caa462;
            background-image: linear-gradient(to left, #46bdf4 0%, #2b56f5 100%);
            text-align: center;
            font-family: 'Nunito', sans-serif;
            font-size:20px">
            <div style=" border: #caa462 solid 2px;">
                   <h2>Обращение с формы сайта</h2>
                    <h2>Будьте вежливы</h2>
                    <p>Имя: ${req.body.name}</p> 
                    <p>email: ${req.body.email}</p>
                    <p>Телефон: ${req.body.number}</p> 
                    <p>Вопрос ${req.body.question}</p>
                    <a  style="color:#caa462" href="www.bluebird.od.ua">BBHUB</a>
                    <a style="color:#caa462" href="tel:380992380425">+380 99 238 04 25</a>
                    <p>${new Date().toISOString().slice(0,10)}</p>
            </div>
            </body>
            </html>`
    }, function(error, response){  //callback
         if(error){
           console.log(error);
        }else{
           console.log("Messages sent");
       }

   smtpTransport.close(); 
    }); });




app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, process.env.IP, function(){
   console.log(`The BB_HUB Server Has Started! at ${PORT}`);
});