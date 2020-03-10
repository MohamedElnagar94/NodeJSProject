let express = require("express");
let profileRoute = express.Router();
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
        // console.log(imageName)
        // imageName = "image_" + Date.now() + "." + file.mimetype.split("/")[1];
        cb(null, "image_" + Date.now() + "." + file.mimetype.split("/")[1])
    }
})
var upload = multer({ storage: storage })

profileRoute.get("/profile",function (request,response) {
    // console.log(response.locals.user);
    let dataUser = response.locals.user;
    let userStatus = response.locals.status;
    speakerModule.find({UserName:dataUser.UserName,Password:dataUser.Password})
    .then((data)=>{
            response.render("profile",{speaker:data,status:userStatus})
    })
    .catch((error)=>{
        console.log(error)
    });
});

profileRoute.post("/editProfile",upload.single('image'),function(request,response){
    if(request.file){
        speakerModule.find({_id:request.body._id})
        .then((data)=>{
            try {
                fs.unlinkSync('public/Images/' + data[0].Image)
            } catch(err) {
                console.error(err)
            }
        })
        .catch((error)=>{
            console.log(error)
        });
        speakerModule.updateOne({_id:request.body._id},
            {$set:
                {
                    FullName:request.body.FullName,
                    UserName:request.body.UserName,
                    Password:request.body.Password,
                    "Address.city":request.body.city,
                    "Address.street":request.body.street,
                    "Address.building":request.body.building,
                    Image:request.file.filename,
                    status:request.body.status
                }
            }).then((data)=>{
            response.redirect(`/${request.session.status}/profile`)
        }).catch((error)=>{
            console.log(error)
        })
    }else{
        speakerModule.updateOne({_id:request.body._id},
            {$set:
                {
                    FullName:request.body.FullName,
                    UserName:request.body.UserName,
                    Password:request.body.Password,
                    "Address.city":request.body.city,
                    "Address.street":request.body.street,
                    "Address.building":request.body.building,
                    status:request.body.status
                }
            }).then((data)=>{
            response.redirect(`/${request.session.status}/profile`)
        }).catch((error)=>{
            console.log(error)
        })
    }
});


module.exports=profileRoute;