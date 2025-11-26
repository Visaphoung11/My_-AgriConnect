import { Schema, Document, model } from "mongoose";
import { IUser } from "@/types/user";
import { match } from "assert";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String, // optional
      trim: true,
    },

    // userName: {
    //   type: String,
    //   required: [true, "Username is required"],
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    // },

    age: {
      type: Number, // optional
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true, // Before saving this value to the database, remove ALL spaces at the beginning and at the end.
      // "   test@gmail.com   " using trim to covert to "test@gmail.com"
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\S+@\S+\.\S+$/.test(value); // basic email validation using regular expression
        },
        message: "Please provide a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      // match: [], //
      validate: {
        validator: function (value: string) {
          return /^[0-9]{8,15}$/.test(value); // 8–15 digits
        },
        message: "Phone number must contain 8–15 digits",
      },
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser & Document>("User", userSchema);
