import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./DB/ConnectDB.js";
import router from "./routers/auth.router.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/auth", router)

app.listen(port, () => {
    console.log(`server started at poart http://localhost:${port} `)
    connectDB();
});
