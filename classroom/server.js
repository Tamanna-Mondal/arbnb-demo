const express = require("express");
const app = express();

app.get("/home" , (req , res) =>{
    res.send("i am root")
})
app.listen(3000 , () => {
    console.log("server listeing to 3000")
});