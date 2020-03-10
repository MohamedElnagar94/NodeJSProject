let express = require("express");
let registerRoute = express.Router();
let path = require("path");
let mongoose = require("mongoose");
require("./../Modules/speakerModule");
let speakerModule = mongoose.model("speakers");
var multer  = require('multer')
// let imageName;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images/')
    },
    filename: function (req, file, cb) {
        cb(null, "image_" + Date.now() + "." + file.mimetype.split("/")[1])
    }
})
var upload = multer({ storage: storage })

registerRoute.get("/register",function (request,response) {
    response.render("register");
});

registerRoute.post("/register", upload.single('image'),function (request,response) {
    speakerModule.find({})
    .then((data)=>{
        if(String(data.length) === "0"){
            let speaker = speakerModule({
                _id:1,
                FullName:request.body.FullName,
                UserName:request.body.UserName,
                Password:request.body.Password,
                Address:{
                    city:request.body.city,
                    street:request.body.street,
                    building:request.body.building
                },
                Image:request.file.filename,
                Status:0
            });
            speaker.save().then((data)=>{
                response.redirect("/login")
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            speakerModule.aggregate([
                {$group: {_id: {$max: "$_id"}}},{$project:{_id:false,id:"$_id"}},{$sort:{id:-1}}
            ]).then((data)=>{
                let speaker = speakerModule({
                    _id:data[0].id + 1,
                    FullName:request.body.FullName,
                    UserName:request.body.UserName,
                    Password:request.body.Password,
                    Address:{
                        city:request.body.city,
                        street:request.body.street,
                        building:request.body.building
                    },
                    Image:request.file.filename,
                    Status:1
                });
                speaker.save().then((data)=>{
                    response.redirect("/login")
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
    })
    .catch((error)=>{
        console.log(error)
    });
});

module.exports=registerRoute;