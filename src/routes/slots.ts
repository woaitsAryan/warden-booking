import { Router } from "express";
import { BookSlot, GetSlot } from "../controller/slotcontroller.js";
import { protect } from "../middleware/protect.js";

const slots = Router();

slots.post("/book", protect, BookSlot);
slots.get("/get", protect, GetSlot);

export default slots;