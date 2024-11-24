const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema; // we store mongoose.Scemea into Schema

//Create Schema
const arbnbScema = new Schema ( {
    title: {
        type : String,
        require : true
    },
    description: String,
    image:{
       
        type: String,
        default:"https://i.pinimg.com/originals/75/20/ab/7520ab3e783fc104d15548a7f9c66514.jpg" ,
        set: (v) => v === ""? "https://i.pinimg.com/originals/75/20/ab/7520ab3e783fc104d15548a7f9c66514.jpg" : v //ternary operator to store default image.
     
    } , 
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ]
});

//model of this Scema..>
const arbnb = mongoose.model("arbnb" , arbnbScema);
module.exports = arbnb; // export the model , 