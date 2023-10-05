import { Document, model, Schema, Model } from "mongoose";

export interface UserInterface extends Document {
    id: string;
    passwordHash: string;
    slots: {
        datetime: Date;
        isBooked?: boolean;
        Bookedby?: string;
    }[];
}

const userSchema = new Schema<UserInterface>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        slots: [
            {
                datetime: {
                    type: Date,
                },
                isBooked: {
                    type: Boolean,
                    default: false,
                },
                Bookedby: {
                    type: String,
                    default: "",
                },
            },
        ],
    },
);

const User: Model<UserInterface> = model<UserInterface>("User", userSchema);

export default User;