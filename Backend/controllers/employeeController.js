import { validationResult } from "express-validator";
import Employee from "../models/Employee.js";
import { PassThrough } from "stream";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const createEmployeeController = async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necessary data",
      });
    }

    //* Destructuring data from request body
    const { name, email, phone, designation, gender, courses } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image are required" });
    }

    //* Validating if the requested employee already exists
    let employee = await Employee.findOne({ email });

    if (employee) {
      return res.status(400).json({
        success: false,
        message: "Sorry, an employee with this email already exists",
      });
    }

    const result = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "uploads/employees/",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Failed to upload image" });
        }

        //* Creating Employee
        employee = await Employee.create({
          name,
          email,
          phone,
          designation,
          gender,
          courses,
          image: result.secure_url,
        });

        res.status(201).json({
          success: true,
          message: "Employee Created Successfully",
          employee,
        });
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getEmployeeController = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).json({
      success: true,
      message: "Employees Fetched Successfully",
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteEmployeeController = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    await Employee.findByIdAndDelete({ _id });

    res.status(200).json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSingleEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const employee = await Employee.findById(id);

    res.status(200).json({
      success: true,
      message: "Employee Fetched Successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateEmployeeController = async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: "Provide necessary data",
      });
    }

    //* Destructuring data from request body
    const { name, email, phone, designation, gender, courses } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Check if the email is already in use by another employee
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Sorry, another employee is registered with this email",
      });
    }

    let updateData = {
      name,
      email,
      phone,
      designation,
      gender,
      courses,
    };

    const result = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "uploads/employees/",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Failed to upload image" });
        }

        updateData.image = result.secure_url;

        console.log("dnvebfvhjbhjfbvf");

        const updatedEmployee = await Employee.findByIdAndUpdate(
          req.params.id,
          { $set: updateData },
          { new: true }
        );

        console.log("dnvebfvhjbhjfbvf");

        res.status(200).json({
          success: true,
          message: "Employee updated Successfully",
          updatedEmployee,
        });
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
