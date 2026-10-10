import {
  createDriver,
  findDriverByIdentifier,
  findDriverById,
  getAllTruckCompanies,
  findTruckCompanyById,
} from "../models/auth.model.js";
import { generateToken } from "../lib/utils.js";

import bcrypt from "bcrypt";

export const driverRegister = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      middleInitial,
      email,
      phoneNumber,
      password,
      truck_company_id,
    } = req.body;

    const existingUser = await findDriverByIdentifier(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const truckCompany = await findTruckCompanyById(truck_company_id);
    if (!truckCompany) {
      return res.status(400).json({
        success: false,
        message: "Truck company not found",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDriver = await createDriver({
      role: "driver",
      lastName,
      firstName,
      middleInitial,
      email,
      phoneNumber,
      password: hashedPassword,
      truck_company_id,
    });

    if (newDriver) {
      generateToken(newDriver.id, res);

      return res.status(201).json({
        success: true,
        message: "Driver registered successfully",
        user: {
          id: newDriver.id,
          username: newDriver.username,
          lastName: lastName,
          firstName: firstName,
          middleInitial: middleInitial,
          email: email,
          phoneNumber: phoneNumber,
          truck_company_id: truck_company_id,
          truck_company_name: truckCompany.name,
        },
      });
    }
  } catch (error) {
    console.error("Registration error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const driverLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await findDriverByIdentifier(username);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const truckCompany = await findTruckCompanyById(user.truck_company_id);

    if (user && isPasswordValid) {
      const token = generateToken(user.id, res);

      const { password: _, ...userData } = user;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          ...userData,
          truck_company_name: truckCompany ? truckCompany.name : null,
        },
      });
    }
  } catch (error) {
    console.error("Login error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const driverLogout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { password: _, ...userData } = user;

    return res.status(200).json({
      success: true,
      message: "User authenticated",
      user: userData,
    });
  } catch (error) {
    console.error("CheckAuth error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getTruckCompanies = async (req, res) => {
  try {
    const truckCompanies = await getAllTruckCompanies();
    return res.status(200).json({
      success: true,
      message: "Truck companies retrieved successfully",
      data: truckCompanies,
    });
  } catch (error) {
    console.error("GetTruckCompanies error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const id = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required",
      });
    }

    const driverProfile = await findDriverById(id);

    if (!driverProfile) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    // I remove the password field from the response
    const { password: _, ...userData } = driverProfile;

    return res.status(200).json({
      success: true,
      message: "Driver profile retrieved successfully",
      user: userData,
    });
  } catch (error) {
    console.error("GetDriverProfile error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
