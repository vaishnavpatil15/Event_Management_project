const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        const con = await mongoose.connect("mongodb+srv://vaishnavbpatil12:Vaishnav123@todo.ueko1sr.mongodb.net/?retryWrites=true&w=majority&appName=ToDo");
        console.log("connected to db");
        console.log(con.connection.host);
        
        
    } catch (error) {
            console.log("error connecting to db ", error.message);
            process.exit(1);
            
    }

}

module.exports = connectDB;