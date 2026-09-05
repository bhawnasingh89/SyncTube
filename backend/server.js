import http from "http";
import {Server} from "socket.io";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import socketHandlers from "./src/socket/socketHandlres.js";
import RoomManager from "./src/services/RoomManager.js";

dotenv.config();


const PORT = process.env.PORT || 5000;


//create http server using express app
const httpServer = http.createServer(app);

//create socket.io server
const io = new Server(httpServer,{
    cors:{
        origin:process.env.CLIENT_URL || "http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    },
});

// Create ONE RoomManager instance
const roomManager = new RoomManager();

//Register Socket.IO handlers
socketHandlers(io,roomManager);

//start server
const startServer = async() =>{
    try{
    await connectDB();

    httpServer.listen(PORT,() =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
    }catch(error){
    console.error("Failed to start server:",error.message);

    process.exit(1);
    }
};
startServer();

