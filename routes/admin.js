const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

router.get("/", adminController.listUsers);
router.get("/add", adminController.addUser);
router.post("/add", adminController.addUser);
router.get("/delete", adminController.deleteUser);
router.post("/delete", adminController.deleteUs);
router.get("/update", adminController.updateUser);
