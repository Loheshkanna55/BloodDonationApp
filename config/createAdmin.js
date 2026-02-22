const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdminIfNotExists = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const admin = new User({
      username: "admin123",
      email: "admin123@gmail.com",
      password: process.env.ADMIN_PASSWORD,
      role: "admin"
    });

    await admin.save();
    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

module.exports = createAdminIfNotExists;
