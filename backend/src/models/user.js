const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String,required: true,unique: true },
    passwordHash:{type: String,required: true,unique: true},
    age:Number,
    gender:Number,
    conditions:[String],
    allergies:[String],
    emergencyContactName:String,
    emergencyContactNumber:String,
});

module.exports = mongoose.model("user",userSchema);