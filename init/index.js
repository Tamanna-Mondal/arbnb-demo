const mongoose = require("mongoose");
main().then( (res) => {console.log("connected with DB")}).catch( (err) => {console.log(err)})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/arbnb');
}

//requesr data.....>
const  data = require("./data");
const  model = require("../models/Listing");


const initDb = async () => {
    await model.deleteMany();
    console.log("deleted all data")
    await model.insertMany(data.data);
    console.log("data save ");
};

initDb();