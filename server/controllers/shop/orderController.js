const { client } = require('../../helpers/paypal');
const Order = require('../../models/Order');
const paypal = require('@paypal/checkout-server-sdk'); 
const mongoose = require('mongoose')
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");




const createOreder = async (req, res) => {
    try {
        const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate,payerId,paymentId, cartId } = req.body;

        // Creating the order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");

        request.requestBody({
            intent: "CAPTURE",  // Change to 'AUTHORIZE' if you want authorization first
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: totalAmount.toFixed(2)
                },
                description: "E-commerce order payment"
            }],
            application_context: {
                brand_name: "Your E-Commerce Store",
                landing_page: "BILLING",
                user_action: "PAY_NOW",
                return_url: "http://localhost:3000/shop/paypal-return",
                cancel_url: "http://localhost:3000/shop/paypal-cancel"
            }
        });

        // Execute the order creation
        const paypalClient = client();
        const response = await paypalClient.execute(request);
         // ✅ Extract PayPal Order ID
         const paypalOrderId = response.result.id;
        // Save order in DB
        const newOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            paypalOrderId
        });

        await newOrder.save();
        console.log(newOrder, 'newOrder------>');
        
        // Get the approval URL
        const approvalURL = response.result.links.find(link => link.rel === 'approve')?.href;

        if (!approvalURL) {
            return res.status(500).json({
                success: false,
                message: "Approval URL not found in PayPal response"
            });
        }

        res.status(201).json({
            success: true,
            approvalURL,
            orderId: newOrder._id,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Error creating PayPal order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order"
        });
    }
};


const capturePayment = async (req, res) => {
  try {
    const { token, orderId } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    // ✅ Find the order in the database
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ✅ Capture PayPal Payment using @paypal/checkout-server-sdk
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});

    const paypalClient = client(); // Initialize PayPal client
    const response = await paypalClient.execute(request);

    // ✅ Extract payment details from PayPal response
    const paymentId = response.result?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "UNKNOWN_PAYMENT_ID";
    const payerId = response.result?.payer?.payer_id || "UNKNOWN_PAYER";

    // ✅ Update Order Payment Status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // ✅ Deduct Stock for Each Ordered Product
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product: ${item.productId}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // ✅ Delete Cart After Successful Payment
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });

  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


module.exports = {
    createOreder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
}



