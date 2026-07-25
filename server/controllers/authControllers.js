import userModel from '../models/userModel.js';
import productModel from "../models/productModel.js";
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';
import bcrypt from 'bcrypt';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Create token
    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
    });
  }
};


//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email) {
      return res.status(400).send({ message: 'Email is required' })
    }

    if (!newPassword) {
      return res.status(400).send({ message: 'New Password is required' })
    }

    //check
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Invalid Email'
      })
    }

    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, { password: hashed })

    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully',
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error
    })
  }
};


//test Controller
export const testController = (req, res) => {
  try {
    res.send('Protected Routes')
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
}

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body
    const user = await userModel.findById(req.user._id)

    //password
    if (password && password.length < 6) {
      return res.json({ error: 'Password must be 6 character long' })
    }

    const hashedPassword = password ? await hashPassword(password) : undefined

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: {
          street: address?.street || "",
          city: address?.city || "",
          state: address?.state || "",
          postalCode: address?.postalCode || "",
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully !",
      updatedUser
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error while update profile",
      error
    })
  }
}

// Get All Users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}, "name email role"); // Fetch all users with selected fields
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id }) // Fetch orders for the logged-in user
      .populate({
        path: "products.product",
        select: "-photo",
      })// Populate product details excluding "photo"
      .populate("buyer", "name"); // Populate buyer details with "name"

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).send({
      success: false,
      message: "Error while getting Orders",
      error,
    });
  }
};

//all orders
// All orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate({
        path: "products.product",
        select: "-photo -__v",
      })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//order status update
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Cannot update cancelled order
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be updated.",
      });
    }

    // Delivered order cannot be changed
    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be updated.",
      });
    }

    // Update order status
    order.status = status;

    // Payment Status Logic
    if (status === "Delivered") {
      order.payment.status = "Paid";
    }

    if (status === "Cancelled") {
      if (order.payment.method === "ONLINE") {
        order.payment.status = "Refunded";
      } else {
        order.payment.status = "Pending";
      }

      // Restore Stock
      for (const item of order.products) {
        const product = await productModel.findById(item.product);

        if (product) {
          product.quantity += item.cartQuantity;
          product.inStock = true;
          await product.save();
        }
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error updating order",
    });
  }
};

//payment status
export const paymentStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.payment.status = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating payment status",
    });
  }
};

//cancel order
export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Restore product stock
    for (const item of order.products) {
      const product = await productModel.findById(item.product);

      if (product) {
        product.quantity += item.cartQuantity;
        product.inStock = true;
        await product.save();
      }
    }

    // Update Order Status
    order.status = "Cancelled";

    // Update Payment Status
    if (order.payment.method === "ONLINE") {
      order.payment.status = "Refunded";
    } else {
      // COD
      order.payment.status = "Pending";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//admin can add the users
export const addUserController = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    console.log("Received data:", req.body); // Log received data for debugging

    // Validate input fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Additional validation for email and phone format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    // Log role validation
    console.log("Role being set:", role);

    // Convert role to number if it's a valid string ("0" or "1")
    const parsedRole = Number(role);
    if (![0, 1].includes(parsedRole)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      role: parsedRole, // Ensure role is a number
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// **Update User Controller**
export const updateUserController = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { userId } = req.params;

    // **Validate Input**
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    // **Find and update user**
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, email, role: Number(role) || 0 }, // Ensure role is a number
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ** Delete User Controller**
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // **Find and delete user**
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const codOrder = async (req, res) => {
  try {
    console.log("Received COD Order Data:", req.body);

    const { cart, address } = req.body;
    const buyer = req.user?._id; // Ensure buyer is extracted from authenticated user

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }
    if (!buyer) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    const products = cart.map((item) => ({
      product: item._id,
      cartQuantity: item.quantity || 1,
      price: item.price,
      name: item.name,
    }));

    const totalAmount = products.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );

    const order = new orderModel({
      products,
      payment: {
        method: "COD",
        status: "Pending",
      },
      buyer,
      address,
      totalAmount,
    });


    for (const item of products) {
      const dbProduct = await productModel.findById(item.product);

      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (dbProduct.quantity < item.cartQuantity) {
        return res.status(400).json({
          success: false,
          message: `${dbProduct.name} is out of stock`
        });
      }
    }

    await order.save();

    for (const item of products) {
      const updatedProduct = await productModel.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            quantity: -item.cartQuantity,
          },
        },
        { new: true }
      );

      updatedProduct.inStock = updatedProduct.quantity > 0;
      await updatedProduct.save();
    }

    res.status(201).json({ success: true, message: "COD order placed successfully", order });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const addAddress = async (req, res) => {
  try {
    const { address } = req.body; // Fix here
    if (!address?.street || !address?.city || !address?.state || !address?.postalCode) {
      return res.status(400).json({ success: false, message: "All address fields are required" });
    }
    // Save address logic here...
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
