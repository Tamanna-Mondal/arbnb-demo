const express = require("express");
const app = express();
app.set("view engine" , "ejs");//ejs
const path = require("path"); //path
app.set ("views" , path.join(__dirname , "views")); //we can run html file outside the file also
app.use (express.static (path.join(__dirname , "public"))); //we can run css/js file outside the file also
app.use (express.urlencoded({extended: true}));

const port = 8080; //port
//error 
const wrapAsync = require("./utels/wrapAsync.js");
const expressError = require("./utels/ExpressError.js");
const {arbnbSchema} = require("./schema.js") ;
const {reviewsSchema} = require("./schema.js") ;
const reviews = require("./models/reviews.js");
const Arbnb = require("./models/Listing.js");
//font

app.use(express.static('public'));

//ejs-mate -  
const ejsMate = require("ejs-Mate");
app.engine('ejs', ejsMate);
//for use put orpost method..>
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//database conn........>
const mongoose = require("mongoose");
main().then( (res) => {console.log("connected with DB")}).catch( (err) => {console.log(err)})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/arbnb');
}
const arbnb = require("./models/Listing");
const { title } = require("process");

//middle ware of serverside error!
const validatearbnb = (req, res, next) => {
   const { error } = arbnbSchema.validate(req.body.arbnb);
   if (error) {
       console.log(error.details); // Log the error details
       throw new expressError(400, error.details.map(err => err.message).join(', '));
   }
   next();
};

//middle ware of serverside reviews error!
const validateReviews = (req, res, next) => {
   const { error } = reviewsSchema.validate(req.body.arbnb);
   if (error) {
       console.log(error.details); // Log the error details
       throw new expressError(400, error.details.map(err => err.message).join(', '));
   }
   next();
};



// app.use((err, req, res, next) => {
//    console.error(err); // Log the error
//    let { status = 500, message = "Something went wrong!" } = err;
//    res.status(status).render("error.ejs", { status, message });
// });


//create ..>
app.get("/arbnb/new" ,(req , res) => {
    
    res.render("arbnb/new.ejs");
 });
 //after submition...
 app.post("/arbnb" ,validatearbnb ,  wrapAsync(async(req , res , next) => {
   console.log("inside")   
   console.log(req.body);
      const newArbnb = new arbnb(req.body.arbnb);
      await newArbnb.save();
      console.log(newArbnb);
      res.redirect("/arbnb");
 }
    

 ));

//update:
app.get("/arbnb/:id/edit" ,  wrapAsync(async (req , res) => {
    let {id} = req.params;
    let arbnbs = await arbnb.findById(id);
   
    res.render("arbnb/update.ejs", {arbnbs});
 }));
 app.put("/arbnb/:id" ,wrapAsync(async (req , res) => {
    let { id} = req.params;
    console.log(id);
    let updatePost = req.body.arbnb;
    await arbnb.findByIdAndUpdate(id , {...req.body.arbnb});
    console.log(updatePost);
    console.log(id);
    
    res.redirect(`/arbnb/${id}`);
 }));

 //Delete........>
 app.delete("/arbnb/:id" ,wrapAsync( async(req , res) => {
   let {id} = req.params;
   let arbnbs = await arbnb.findByIdAndDelete(id);
   console.log(arbnbs);
   res.redirect("/arbnb");
}));
//print indivutal data....>
app.get("/arbnb/:id" ,wrapAsync(async(req , res) => {
    let {id} = req.params;
    let arbnbs =await Arbnb.findById(id).populate("reviews");
    console.log(arbnbs);
    res.render("arbnb/show.ejs" , {arbnbs});
 }));
//print all data..>
app.get("/arbnb" ,wrapAsync( async(req , res) => {
   let arbnbs = await arbnb.find({});
   res.render("arbnb/index.ejs" , {arbnbs});
}));

//reviews  
app.post("/arbnb/:id/reviews" ,validateReviews ,  wrapAsync( async(req, res) => {
      let arbnb = await Arbnb.findById(req.params.id);
      let newReviews = new reviews(req.body.reviews);

      arbnb.reviews.push(newReviews);
      await newReviews.save();
      await arbnb.save();
      console.log(newReviews , arbnb);
      res.redirect(`/arbnb/${arbnb._id}`)
   }));
//delete review 
app.delete("/arbnb/:id/reviews/reviewsId", wrapAsync(async(req, res) =>{
   let {id , reviewsId} = req.params;
   await arbnb.findByIdAndUpdate(id, {$pull: {reviews: {reviewsId}}})
   await reviews.findById(reviewsId);
   res.redirect(`/arbnb/${id}`);

}))

// test root..>
// app.get(("/testRoot"), async(req , res) => { 
//     let sampleListing = new arbnb ({
//         title : "My Home",
//         description : "Buaty Full",
         
//         price:22000,
//         location:"Digha",
//         country:"india"
//     });
//    await sampleListing.save();
//    console.log("sample was save");
//    res.send("everything done")
// });

// all error..>
app.all("*" , (req ,res ,next) =>{
   next(new expressError(404 , "Page Not Found"))
});
// error handler middleware:
app.use((err ,req ,res ,next) => {
   let { status=505 , message="Something went worng!"} = err
   
   res.status(status).render("error.ejs" , {status , message});
   
});


app.listen(port , () => { //server
    console.log("server working properly !")
})


