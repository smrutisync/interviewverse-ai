const express = require("express");
const app = express();
app.get("/",(req,res)=>{res.send("InterviewVerse AI Backend is running...");});
module.exports = app;