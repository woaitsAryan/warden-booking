import catchAsync from "../helpers/catchAsync.js";
import {Request, Response} from "express";
import User from "../models/userModel.js";

export const BookSlot = catchAsync(
    async (req: Request, res: Response) => {
        const {bookid, datetime} = req.body;
        const targetwarden = await User.findOne({id: bookid});
        const slotDatetime = new Date(datetime);
        
        const targetSlot = targetwarden.slots.find(
            (slot) => slot.datetime.getTime() === slotDatetime.getTime()
        );
        if (targetSlot) {
            targetSlot.isBooked = true;
            targetSlot.Bookedby = req.user.id;
            await targetwarden.save();
            return res.status(200).json({
            status: "success",
            message: "Slot booked successfully",
            });
        } else {
            return res.status(404).json({
            status: "fail",
            message: "Slot not found",
            });
        }
})

export const GetSlot = catchAsync(
    async(req: Request, res: Response) => {
    const now = new Date();

    const warden = await User.findOne({ id: req.user.id });
    const slots = warden.slots.filter(
        (slot) => slot.datetime >= now
      ).map((slot) => ({
        datetime: slot.datetime,
        isBooked: slot.isBooked,
        bookedBy: slot.Bookedby,
      }));

  return res.status(200).json({
    status: "success",
    data: {
        slots,
    },
    });
})