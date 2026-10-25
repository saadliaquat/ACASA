import express from "express";
import cors from "cors";
import { register, login } from "../controllers/User.js";



const app = express.Router();



app.post("/register",register);
app.post("/login",login);



export default app;
