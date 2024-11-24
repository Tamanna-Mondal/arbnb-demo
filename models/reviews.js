const { types, number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // we store mongoose.Scemea into Schema

const reviewsSchema = new Schema( {
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAT: {
        type:Date,
        default:Date.now() //
    }
});

module.exports = mongoose.model("Reviews" , reviewsSchema);


