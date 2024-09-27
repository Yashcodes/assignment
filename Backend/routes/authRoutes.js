import express from "express";
import {
  loginController,
  registerController,
  getUserController,
} from "../controllers/authController.js";
import { body } from "express-validator";
const router = express.Router();
import { requireSignIn } from "../middlewares/authMiddleware.js";

router.post(
  "/register",
  [
    body("name", "Name must be of 6 characters").exists().isLength({ min: 6 }),
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be 8 characters long")
      .exists()
      .isLength({ min: 8 }),
  ],

  registerController
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").exists().isEmail(),
    body("password", "Password must be 8 characters long")
      .exists()
      .isLength({ min: 8 }),
  ],
  loginController
);

//? ROUTE 3 : ROUTE FOR GETTING USER DETAILS
router.get("/get-user", requireSignIn, getUserController);


export default router;
