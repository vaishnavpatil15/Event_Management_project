const express = require("express");
const router = express.Router();

const{registerUser,loginUser} =require("../controller/user.controller")



router.get("/",(req,res)=>{
    res.send("login page")
    // res.render("")
})

router.post("/register",registerUser);


router.post("/login",loginUser);



module.exports = router;