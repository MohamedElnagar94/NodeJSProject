let mongoose = require("mongoose");
var moment = require('moment');
let eventModel = new mongoose.Schema({
    _id:Number,
    title:String,
    event:String,
    mainSpeaker:{type:Number,ref:"speakers"},
    otherSpeakers:[{type:Number,ref:"speakers"}]
});

mongoose.model("event",eventModel);
