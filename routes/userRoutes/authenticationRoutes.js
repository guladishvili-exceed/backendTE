const express = require("express");

const router = express.Router();

const {
  getUserById,
  registerHandler,
  defaultLoginHandler,
  socialLoginHandler,
  forgotPasswordVerificationHandler,
  updatePasswordHandler,
  defaultLogOutHandler,
} = require("../../controllers/authenticationControllers");

const verify = require("../../verifyToken");

router.get("/get_user_by_id/:id", verify, getUserById);

router.post("/register/", registerHandler);

router.post("/default_login", defaultLoginHandler);

router.put("/default_log_out", defaultLogOutHandler);

router.post("/social_network_login", socialLoginHandler);

router.post("/forgot_password_verification", forgotPasswordVerificationHandler);

router.put("/update_user_password", updatePasswordHandler);

module.exports = router;
