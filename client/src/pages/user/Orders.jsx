import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch Orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const { data } = await axios.delete(`/api/v1/auth/orders/${orderId}`);
      if (data.success) {
        toast.success("Order cancelled successfully!");
        getOrders();
      } else {
        toast.error("Failed to cancel order.");
      }
    } catch (error) {
      console.log("Error cancelling order:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-3">All Orders</h1>

            {orders?.length === 0 ? (
              <p className="text-center text-muted mt-5">No orders found.</p>
            ) : (
              orders.map((order, i) => (
                <div className="card order-card mb-4" key={order._id}>
                  <div className="order-header">
                    <h5>Order #{i + 1}</h5>

                    <span
                      className={`badge ${
                        order.status === "Processing"
                          ? "bg-warning text-dark"
                          : order.status === "Shipped"
                            ? "bg-primary"
                            : order.status === "Out for Delivery"
                              ? "bg-info text-dark"
                              : order.status === "Delivered"
                                ? "bg-success"
                                : order.status === "Cancelled"
                                  ? "bg-danger"
                                  : "bg-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ORDER SUMMARY */}
                  <div className="table-responsive">
                    <table className="table order-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Payment</th>
                          <th>Method</th>
                          <th>Total Quantity</th>
                          <th>Total Amount</th>
                          <th>Address</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>{order?.status}</td>
                          <td>{moment(order?.createdAt).fromNow()}</td>

                          <td>
                            <span
                              className={`badge ${
                                order.payment?.status === "Paid"
                                  ? "bg-success"
                                  : order.payment?.status === "Pending"
                                    ? "bg-warning text-dark"
                                    : order.payment?.status === "Refunded"
                                      ? "bg-info text-dark"
                                      : "bg-danger"
                              }`}
                            >
                              {order.payment?.status}
                            </span>
                          </td>

                          <td>{order?.payment?.method}</td>

                          {/* TOTAL QUANTITY */}
                          <td>
                            {order?.products?.reduce(
                              (acc, p) => acc + (p.cartQuantity || 1),
                              0,
                            )}
                          </td>

                          {/* TOTAL PRICE */}
                          <td>
                            $
                            {order?.products
                              ?.reduce(
                                (acc, p) =>
                                  acc + p.price * (p.cartQuantity || 1),
                                0,
                              )
                              .toFixed(2)}
                          </td>

                          <td>
                            {order?.address
                              ? `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.postalCode}`
                              : "No Address"}
                          </td>

                          <td>
                            {[
                              "Processing",
                              "Shipped",
                              "Out for Delivery",
                            ].includes(order.status) ? (
                              <button
                                className="cancel-btn"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="badge bg-secondary">
                                {order.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* PRODUCT LIST */}
                  <div className="container">
                    {order?.products?.map((p) => (
                      <div className="order-product" key={p._id}>
                        <div className="row align-items-center">
                          <div className="col-md-3 text-center">
                            <img
                              src={`/api/v1/product/product-photo/${p.product?._id}`}
                              className="order-product-img"
                              alt={p.product?.name}
                            />
                          </div>

                          <div className="col-md-9">
                            <h5 className="fw-bold">{p.product?.name}</h5>

                            <p className="text-muted">
                              {p.product?.description
                                ? `${p.product.description.substring(0, 60)}...`
                                : "No description"}
                            </p>

                            <div className="order-product-info">
                              <span className="qty-badge">
                                Qty : {p.cartQuantity}
                              </span>
                              <div className="order-price">₹ {p.price}</div>

                              <div className="order-total">
                                Total : ₹{" "}
                                {(p.price * p.cartQuantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
