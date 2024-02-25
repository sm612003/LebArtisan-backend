import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/MongoConfig.js";
import cors from "cors";
import { login } from "./Middlewares/authentication.js";
import { logOut } from "./Middlewares/authentication.js";
import { verifyToken } from "./Middlewares/authentication.js";
import { loggedInUser } from "./Middlewares/authentication.js";
import userRoutes from "./Routes/Routes/userRoutes.js";
import { addUser } from "./controllers/GoogleAuth.js";

import productRoutes from "./Routes/Routes/productRoutes.js";
import WorkshopRoutes from "./Routes/Routes/WorkshopRoutes.js";
import EventRoutes from "./Routes/Routes/EventsRoutes.js";
import CategoryRoutes from "./Routes/Routes/CategoryRoutes.js";
import ArtistRoutes from "./Routes/Routes/ArtisanRoutes.js";
import upload from "./Middlewares/multer.js";

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));
// Define the endpoint to handle video uploads
app.post("/upload-video", upload.single('video'), (req, res) => {
  // If the file is uploaded successfully, send a response
  res.send("Video uploaded successfully");
});
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT;

app.listen(PORT, (error) =>{ 
    if(!error) {
        console.log("Server is Running, and App is listening on port "+ PORT) 
    } else {
        console.log("Error: ", error)
    }
} 
);
connectDB()
app.use('/product',productRoutes)
app.use("/user", userRoutes);
app.use("/workshop",WorkshopRoutes)
app.use("/category",CategoryRoutes)
app.use("/events", EventRoutes)
app.use("/artist", ArtistRoutes)

app.use("/google",addUser)
app.post("/login", login);
app.post("/logout", logOut);

app.use('/images',express.static('images'))
app.use('/videos', express.static('videos'));


app.get("/logged-in-user", verifyToken, loggedInUser);


app.post("/logout", logOut);

// app.use("/public", express.static(path.join(__dirname, "public")));
