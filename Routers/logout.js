let express = require("express");
let logoutRoute = express.Router();
let path = require("path");

logoutRoute.get("/logout",function (request,response) {
    request.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        response.redirect('/login');
    });
    // response.render("login");
});

module.exports=logoutRoute;