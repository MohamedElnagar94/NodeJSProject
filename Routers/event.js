const express=require("express");
const eventRouter=express.Router();
let path = require("path");
let mongoose = require("mongoose");
require("./../Modules/eventModule");
let eventModule = mongoose.model("event");
require("./../Modules/speakerModule");
let speakerModule = mongoose.model("speakers");
// var moment = require('moment');

eventRouter.get("/list",function(request,response){
    eventModule.find({}).populate({path:"mainSpeaker otherSpeakers"})
    .then((events)=>{
        // response.send(events)
        // events.event = moment(events.event).format("YYYY-MM-DD")
        speakerModule.find({}).then((speakers)=>{
            response.render("events/events",{events:events,speakers:speakers})
            // response.send({speaker:[dataUser]})
        }).catch(()=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    });
});
eventRouter.get("/add",function(request,response){
    speakerModule.find({}).then((speakers)=>{
        response.render("events/eventAdd",{speakers:speakers})
        // response.send({events:events,speakers:speakers})
    }).catch(()=>{
        console.log(error)
    })
    // response.render("events/eventAdd");
});
eventRouter.post("/add",function(request,response){
    // response.send(request.body)
    // let date = moment(request.body.event).format("YYYY-MM-DD");
    eventModule.find({})
    .then((data)=>{
        // response.send(String(data.length))
        if(String(data.length) === "0"){
            let event = eventModule({
                _id:1,
                title:request.body.title,
                event:request.body.event,
                mainSpeaker:request.body.mainSpeaker,
                otherSpeakers:request.body.otherSpeakers
            })
            event.save().then((data)=>{
                response.redirect("/event/list")
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            eventModule.aggregate([
                {$group: {_id: {$max: "$_id"}}},{$project:{_id:false,id:"$_id"}},{$sort:{id:-1}}
            ]).then((data)=>{
                let event = eventModule({
                    _id:data[0].id + 1,
                    title:request.body.title,
                    event:request.body.event,
                    mainSpeaker:request.body.mainSpeaker,
                    otherSpeakers:request.body.otherSpeakers
                })
                event.save().then((data)=>{
                    response.redirect("/event/list")
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
        
        // response.send(data[0])
    })
    .catch((error)=>{
        console.log(error)
    });
});
eventRouter.post("/delete",function(request,response){
    eventModule.deleteOne({_id:request.body._id}).then(()=>{
        response.json("deleted successfully")
    }).catch((error)=>{
        response.json("deleted does not successfully")
    })
});
eventRouter.get("/edit",function(request,response){
    eventModule.find({_id:request.query._id}).then((data)=>{
        response.send(data)
    }).catch((error)=>{
        console.log(error)
    })
});
eventRouter.post("/edit",function(request,response){
    // response.json(request.body)
    // let date = moment(request.body.event).format("DD/MM/YYYY")
    eventModule.updateOne({_id:request.body._id},
        {$set:
            {
                title:request.body.title,
                event:request.body.event,
                mainSpeaker:request.body.mainSpeaker,
                otherSpeakers:request.body.otherSpeakers
            }
        }).then((data)=>{
        response.redirect("/event/list")
    }).catch((error)=>{
        console.log(error)
    })
});

module.exports=eventRouter;