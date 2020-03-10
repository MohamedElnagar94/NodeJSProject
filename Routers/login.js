let express = require("express");
let loginRoute = express.Router();
let path = require("path");
let mongoose = require("mongoose");
require("./../Modules/speakerModule");
let loginModule = mongoose.model("speakers");

loginRoute.get("/login",function (request,response) {
    response.render("login")
});

loginRoute.post("/login",function (request,response) {
    let session = request.session;
    session.data = request.body;
    // console.log(request);
    loginModule.find({UserName:request.body.UserName,Password:request.body.Password}).then((data)=>{
        if(data.length === 0){
            response.redirect("/login");
        }else{
            switch (data[0].Status) {
                case 0:
                    // console.log("admin");
                    session.status = "admin";
                    session.statusNumber = 0;
                    console.log(request.session);
                    response.redirect("/admin/profile");
                    break;
                case 1:
                    // console.log("speaker");
                    session.status = "speaker";
                    session.statusNumber = 1;
                    response.redirect("/speaker/profile");
                    break;
                default:
                    break;
            }
        }
    }).catch((error)=>{
        response.send(error)
    })

});
module.exports=loginRoute;