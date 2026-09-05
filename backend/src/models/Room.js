import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        maxlength:30,
    },
    role:{
        type:String,
        enum:["host","moderator","participant"],
        default:"participant",
    },
},{_id:false});

const roomSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    hostId:{
        type:String,
        required:true,
    },
    videoId:{
        type:String,
        default:"",
    },
    playbackState:{
        type:String,
        enum:["playing","paused"],
        default:"paused",
    },
    currentTime:{
        type:Number,
        default:0,
    },
    lastUpdatedAt:{
        type:Date,
        default:Date.now,
    },
    participants:{
        type:[participantSchema],
        default:[],
    },
},{
    timestamps:true,
});

const Room = mongoose.model("Room",roomSchema);

export default Room;