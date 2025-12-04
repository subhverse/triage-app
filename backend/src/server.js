require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const triageRoutes = require("./routes/triageRoutes");


const app = express();
app.use(express.json());
app.use("/auth",authRoutes);
app.use("/triage", triageRoutes);


//health check
app.get("/health",(req,res) => res.json({ok:true}));

const start = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB.connected");
        app.listen(process.env.PORT || 4000,() =>
        console.log("Server running on port",process.env.PORT || 4000)
    );
    }catch(err){
        console.error("Failed to start:",err.message);
        process.exit(1);
    
    }
};

start();