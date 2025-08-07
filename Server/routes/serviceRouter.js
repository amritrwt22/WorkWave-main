const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/servicesController");
const authMiddleware = require("../middlewares/businessOwnerMiddleware"); // Uncomment this if you want to enforce authentication

// Route to add a new service
router.post(
  "/addservice",
  authMiddleware, // Uncomment this line if you want to secure the route
  servicesController.addService
);
router.post("/delete/:id" , servicesController.deleteService)
router.post("/update/:id" , servicesController.updateService)
router.get("/adminDashboard" , servicesController.getServicesAdminDashboard)
router.get("/:id", servicesController.getService);
router.get("/name/:serviceId" , servicesController.getServiceName);
module.exports = router;