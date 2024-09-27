import express from "express";
import { body } from "express-validator";
const router = express.Router();
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createEmployeeController,
  deleteEmployeeController,
  getEmployeeController,
  getSingleEmployeeController,
  updateEmployeeController,
} from "../controllers/employeeController.js";
import { imageFileFilter } from "../helpers/fileFilter.js";
import multer from "multer";

const storage = multer.memoryStorage();
const maxSize = 1 * 1024 * 1024;

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    imageFileFilter(file, cb);
  },
});

router.post(
  "/create-employee",
  upload.single("employeeeImage"),
  [
    body("name", "Name must be of 6 characters").exists().isLength({ min: 6 }),
    body("email", "Enter a valid email").exists().isEmail(),
    body("phone", "Phone must be of 10 characters")
      .exists()
      .isLength({ min: 10 }),
    body("designation", "Designation should not be empty")
      .exists()
      .isLength({ min: 1 }),
    body("gender", "Gender should not be empty").exists().isLength({ min: 1 }),
    body("courses", "Course should not be empty").exists().isLength({ min: 1 }),
    // body("image", "Image should not be empty").exists().isLength({ min: 1 }),
  ],
  requireSignIn,
  createEmployeeController
);

router.get("/user-auth", requireSignIn, (req, res) => {
  return res.status(200).json({ ok: true });
});

router.get("/get-all-employee", requireSignIn, getEmployeeController);

router.delete("/delete-employee/", requireSignIn, deleteEmployeeController);

router.get("/get-employee/:id", requireSignIn, getSingleEmployeeController);

router.put(
  "/update-employee/:id",
  upload.single("employeeeImage"),
  [
    body("name", "Name must be of 6 characters").exists().isLength({ min: 6 }),
    body("email", "Enter a valid email").exists().isEmail(),
    body("phone", "Phone must be of 10 characters")
      .exists()
      .isLength({ min: 10 }),
    body("designation", "Designation should not be empty")
      .exists()
      .isLength({ min: 1 }),
    body("gender", "Gender should not be empty").exists().isLength({ min: 1 }),
    body("courses", "Course should not be empty").exists().isLength({ min: 1 }),
    // body("image", "Image should not be empty").exists().isLength({ min: 1 }),
  ],
  requireSignIn,
  updateEmployeeController
);

export default router;
