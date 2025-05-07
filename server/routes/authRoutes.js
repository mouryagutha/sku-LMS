import express from "express";
import { adminLogin ,studentLogin,validateAdminToken} from "../controller/authController.js";
import Admin from "../schemas/adminSchema.js";

const authRoutes = express.Router();

authRoutes.post("/admin", adminLogin);

authRoutes.post('/student',  studentLogin);

authRoutes.get("/vadmin",validateAdminToken);

authRoutes.post('/newadmin', async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
  
      const newAdmin = new Admin({
        email,
        password,
        name,
        role
      });
  
      await newAdmin.save();
  
      res.status(201).json({ message: 'Admin user created successfully', admin: newAdmin });
    } catch (error) {
      res.status(400).json({ message: 'Error creating admin user', error: error.message });
    }
  });

export default authRoutes;
