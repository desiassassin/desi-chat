import mongoose from "mongoose";
import validator from "validator";
import { hash } from "bcrypt";

const userSchema = new mongoose.Schema(
     {
          username: {
               type: String,
               unique: true,
               required: [true, "Username is required."],
               maxlength: [50, "Username is too long."],
               minlength: [3, "Username is too short."],
               trim: true,
               validate: {
                    validator: function (name) {
                         return !/[^a-zA-Z0-9_]/.test(name);
                    },
                    message: "Username should only contain alpha-numeric characters [a-z][A-Z][0-9] UNDERSCORE",
               },
          },
          password: {
               type: String,
               required: [true, "Password is required."],
               maxlength: [64, "Password should not be longer than 64 characters."],
               minlength: [8, "Password should be atleast 8 characters long."],
               trim: true,
               validate: {
                    validator: function (password) {
                         return validator.isStrongPassword(password, {
                              minLength: 8,
                              minLowercase: 0,
                              minUppercase: 0,
                              minNumbers: 0,
                              minSymbols: 0,
                         });
                    },
                    message: "Password is weak.",
               },
          },
          status: {
               type: String,
               required: [true, "Status is required."],
               enum: ["Online", "Offline"],
               default: "Online",
          },
          friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
          friendRequestsSent: [{ type: mongoose.Types.ObjectId, ref: "User" }],
          friendRequestsPending: [{ type: mongoose.Types.ObjectId, ref: "User" }],
          blocked: [{ type: mongoose.Types.ObjectId, ref: "User" }],
          conversations: [
               {
                    type: mongoose.Types.ObjectId,
                    ref: "Conversation",
               },
          ],
          locked: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true }
);

userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     this.password = await hash(this.password, 10);
     next();
});

export const User = mongoose.model("User", userSchema);
