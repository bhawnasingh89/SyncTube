import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//Middleware
app.use(
    cors({
        origin:process.env.CLIENT_URL || "http:''localhost:5173",
        credentials:true,
    })
);

app.use(express.json());

app.get("/",(req,res) =>{
    res.json({
        success:true,
        message:"Watch Party API is running",
    });
});

export default app;