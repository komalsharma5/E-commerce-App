const express = require("express");

const { createOreder, capturePayment, getAllOrdersByUser, getOrderDetails } = require("../../controllers/shop/orderController");

const router = express.Router();

router.post("/create", createOreder);;
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);


module.exports = router;