import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

const verifyToken = (token) => {
	try {
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  return decoded;
	} catch (error) {
	  return null; // Return null if the token is invalid or expired
	}
  };

userRouter.post(
	"/signin",
	expressAsyncHandler(async (req, res) => {
	  // Check if the request contains a valid token
	  const providedToken = req.headers.authorization;
  
	  if (!providedToken || !providedToken.startsWith("Bearer ")) {
		res.status(401).send({ message: "Invalid token. Please provide a valid token in the 'Authorization' header." });
		return;
	  }
  
	  // Extract the token from the "Bearer" format
	  const token = providedToken.split(" ")[1];
  
	  // Verify the token
	  const decodedToken = verifyToken(token);
  
	  if (!decodedToken) {
		res.status(401).send({ message: "Invalid token. Please provide a valid token in the 'Authorization' header." });
		return;
	  }
  
	  // If the token is valid, generate and return a new token
	  res.send({
		_id: decodedToken._id,
		name: decodedToken.name,
		email: decodedToken.email,
		isAdmin: decodedToken.isAdmin,
		token: generateToken(decodedToken),
	  });
	})
  );
  

userRouter.post(
	"/signup",
	expressAsyncHandler(async (req, res) => {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password),
		});
		const user = await newUser.save();
		res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user),
		});
	})
);

userRouter.get(
	"/profile",
	expressAsyncHandler(async (req, res) => {
	  // Verify the token and retrieve the user details
	  const userId = req.params.userId;
	  const user = await User.findById(userId); // Assuming the authenticated user's ID is stored in req.user._id
	  if (user) {
		res.send({
		  _id: user._id,
		  name: user.name,
		  email: user.email,
		  isAdmin: user.isAdmin,
		});
	  } else {
		res.status(404).send({ message: "User not found" });
	  }
	})
  );


export default userRouter;
