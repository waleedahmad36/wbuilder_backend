import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    logo:{
        type:String,
        default:"",
    },
    sublogo:{
        type:String,
        default:"",
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    about:{
        type:String,
        default:"",
    },
    description : {
        type: String,
        required: true,
    },
    image:{
        type:String,
        default:"",
    },
    fbLink:{
        type:String,
        default:"",
    },
    githubLink:{
        type:String,
        default:"",
    },
    linkedinLink:{
        type:String,
        default:"",
    },
    twitterLink:{
        type:String,
        default:"",
    },
    template:{
        type:String,
        default:"template1",
    },
    cv: {
        type: String,
        default: "",
    },
    projects : {
        type:[{
            title:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            image:String,
            link:String,
            code:String,
        }],
        default:[],
    },
    skills : {
        type:[{
            title:String,
            effeciency:String,
        }],
        default:[],
    },
    address:{
        type:String,
        default:"",
    },
    phone:{
        type:String,
        default:"",
    },
    email:{
        type:String,
        default:"",
    },
});

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);