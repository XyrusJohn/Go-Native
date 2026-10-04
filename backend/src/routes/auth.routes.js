import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  driverRegister,
  driverLogin,
  checkAuth,
  driverLogout,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/register", driverRegister);
router.post("/login", driverLogin);
router.post("/logout", driverLogout);

router.get("/check", protectRoute, checkAuth);
export default router;
