let mongoose = require("mongoose");

let speakerModel = new mongoose.Schema({
    _id:Number,
    FullName:String,
    UserName:String,
    Password:String,
    Address:{
        city:String,
        street:Number,
        building:Number
    },
    Image:String,
    Status:Number
});

mongoose.model("speakers",speakerModel);