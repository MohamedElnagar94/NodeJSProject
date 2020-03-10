const express=require("express");
const speakerRouter=express.Router();
let path = require("path");
const fs = require('fs')
let mongoose = require("mongoose");
require("./../Modules/speakerModule");
let speakerModule = mongoose.model("speakers");
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Images/')
    },
    filename: function (req, file, cb) {
        cb(null, "image_" + Date.now() + "." + file.mimetype.split("/")[1])
    }
})
var upload = multer({ storage: storage })


speakerRouter.get("/list",function(request,response){
    speakerModule.find({})
    .then((data)=>{
        response.render("speaker/speakers",{users:data})
        // response.send(data[0])
    })
    .catch((error)=>{
        console.log(error)
    });
    
});
speakerRouter.get("/add",function(request,response){
    response.render("speaker/speakerAdd");
});

speakerRouter.post("/add", upload.single('image'),function(request,response){
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
                response.redirect("/speaker/list")
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
                    response.redirect("/speaker/list")
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
speakerRouter.post("/delete",function(request,response){
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
    speakerModule.deleteOne({_id:request.body._id}).then(()=>{
        response.json("done");
    }).catch((error)=>{
        response.json("deleted does not successfully");
    })
});

speakerRouter.get("/edit",function(request,response){
    speakerModule.find({_id:request.query._id}).then((data)=>{
        response.send(data)
    }).catch((error)=>{
        console.log(error)
    })
});

speakerRouter.post("/edit",upload.single('image'),function(request,response){
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
            response.redirect("/speaker/list")
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
            response.redirect("/speaker/list")
        }).catch((error)=>{
            console.log(error)
        })
    }
});

module.exports=speakerRouter;