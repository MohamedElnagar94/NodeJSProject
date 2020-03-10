let express = require("express");
let mongoose = require("mongoose");
const Swal = require('sweetalert2');
const server = express();
let path=require("path");
let loginRoute = require("./Routers/login");
let registerRoute = require("./Routers/register.js");
let profileRoute = require("./Routers/profile.js");
let speakerRoute = require("./Routers/speaker.js");
let eventRoute = require("./Routers/event.js");
let adminRoute = require("./Routers/admin.js");
let logoutRoute = require("./Routers/logout.js");
let session = require('express-session');
// var moment = require('moment');

server.listen(8090,function(){
    console.log("I am listening on 8090....");
});

mongoose.connect("mongodb://localhost:27017/NodeProject")
        .then(()=>{
            console.log("connected to database ...........................");
        })
        .catch(()=>{
            console.log("can not to database ...........................");
        });

server.use(function (request,response,next) {
    // console.log();
    console.log(`Middle were : ${request.method} - ${request.url}`);
    next();
});



server.use(session({secret: 'Iam secret',saveUninitialized: true,resave: true,cookie: { maxAge: 3600000 }}));

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.set("view engine","ejs");
server.set("views",path.join(__dirname,"/views"));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'node_modules','select2','dist')));
server.use(express.static(path.join(__dirname, 'node_modules','sweetalert2','dist')));


server.use(loginRoute);
server.use(registerRoute);
// server.post("/speaker/add", upload.single('image'),function(request,response){
//     console.log(request.body)
//     console.log(request.file)
//     response.json(request.body)

// });
server.use(function(request,response,next){
    // console.log()
    if(request.session.data){
        response.locals.user = request.session.data;
        response.locals.status = request.session.status;
        response.locals.statusNumber = request.session.statusNumber;
        console.log(response.locals);
        next();
    }else{
        response.redirect("/login")
    }
});
server.use(logoutRoute);
server.use(["/admin","/speaker"],profileRoute);
server.use("/speaker",speakerRoute);
server.use("/admin",adminRoute);
server.use("/event",eventRoute);

server.get(["/home","/"],function(request,response){
    response.render("index");
});

