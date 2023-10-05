import validator from "validator";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import catchAsync from "../helpers/catchAsync.js";
import mongoose from "mongoose";
import { Response, Request } from "express";
import envHandler from "../helpers/envHandler.js";
import User from "../models/userModel.js";


export const Registercontroller = catchAsync(
  async (req: Request, res: Response) => {
    let { id, password } = req.body;
    id = id.trim();
    password = password.trim();

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
      })
    ) {
      return res.status(400).json({
        token: "",
        error:
          "Password must be at least 8 characters long and contain at least 1 number",
      });
    }

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res
        .status(400)
        .json({ token: "", error: "Username already exists" });
    }
    const salt = genSaltSync(10);
    const hashedpassword = hashSync(password, salt);
    const newUser = new User({
      id: id,
      passwordHash: hashedpassword,
    });
    
    const now = new Date();
    const thursday = new Date(now);
    thursday.setDate(now.getDate() + ((4 - now.getDay()) % 7));
    thursday.setHours(10, 0, 0, 0);
    const friday = new Date(thursday);
    friday.setDate(thursday.getDate() + 1);
    console.log(friday, thursday);
    for (let i = 0; i < 2; i++) {
        newUser.slots.push({ datetime: new Date(thursday) });
        newUser.slots.push({ datetime: new Date(friday) });
        thursday.setDate(thursday.getDate() + 7);
        friday.setDate(friday.getDate() + 7);
        
    }
    console.log(newUser.slots);
    await newUser.save();
    const token = jwt.sign({ userID: newUser._id }, envHandler("JWT_SECRET"), {
      expiresIn: "30d",
    });
    const returnpayload = { token: token, error: "" };
    return res.json(returnpayload);
  }
);

export const Logincontroller = catchAsync(
  async (req: Request, res: Response) => {
    let { id, password } = req.body;
    id = id.trim();
    password = password.trim();

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const result = compareSync(password, user.passwordHash);
    if (!result) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ userID: user._id }, envHandler("JWT_SECRET"), {
      expiresIn: "30d",
    });
    return res.json({ token });
  }
);
