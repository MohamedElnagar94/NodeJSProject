const express=require("express");
const adminRouter=express.Router();
let path = require("path");

adminRouter.get("/list",function(request,response){
    response.send("list admin")
});
adminRouter.get("/add",function(request,response){
    response.send("add admin")
});
adminRouter.get("/delete",function(request,response){
    response.send("delete admin")
});
adminRouter.get("/edit",function(request,response){
    response.send("edit admin")
});

// adminRouter.get("/profile",function(request,response){
//     response.send("admin profile")
// });


module.exports=adminRouter;