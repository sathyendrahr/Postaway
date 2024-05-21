import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name must be atleast 3 characters"],
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
    trim: true,
    match: [
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      "Invalid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Others"],
    trim: true,
  },
  avatar: {
    type: String,
  },
  tokens: [
    new mongoose.Schema({
      jwtToken: { type: String },
      clientId: { type: String },
    }),
  ],
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
