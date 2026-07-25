import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { addAddress, addUserController, cancelOrderController, codOrder, deleteUserController, forgotPasswordController, getAllOrdersController, getAllUsersController, getOrdersController, loginController, orderStatusController, paymentStatusController, registerController, testController, updateProfileController, updateUserController } from '../controllers/authControllers.js';

//router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register', registerController)

//LOGIN POST
router.post('/login', loginController)

//forget password || post
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test', requireSignIn, isAdmin, testController)

// protected route auth(user)
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})
// protected route auth(admin)
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
})

// Get all users (Admin only)
router.get('/all-users', requireSignIn, isAdmin, getAllUsersController);

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get('/orders', requireSignIn, getOrdersController)

//payment
router.put("/payment-status/:orderId", requireSignIn, isAdmin, paymentStatusController);

//All orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

// Cancel order (User only)
router.delete('/orders/:orderId', requireSignIn, cancelOrderController);

//admin can add the users
router.post('/add-user', requireSignIn, isAdmin, addUserController);

//admin can delete the users
router.delete('/delete-user/:userId', requireSignIn, isAdmin, deleteUserController);

// Update User (Admin only)
router.put('/update-user/:userId', requireSignIn, isAdmin, updateUserController);

//cash on delivery
router.post("/orders/cod", requireSignIn, codOrder);

//shipping address
router.post("/address", requireSignIn, addAddress);
export default router