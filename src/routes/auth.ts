import { Router } from "express";
import { Logincontroller, Registercontroller } from "../controller/authcontroller.js";

const auth = Router();

auth.post("/login", Logincontroller);
auth.post("/register", Registercontroller);

export default auth;