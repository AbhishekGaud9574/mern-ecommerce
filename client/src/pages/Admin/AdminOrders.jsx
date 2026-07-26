import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import "../../css/AdminOrders.css";
import { API } from "../../axiosSetup";

function AdminOrders() {
  const [paymentStatus] = useState(["Pending", "Paid", "Failed", "Refunded"]);

  const [status] = useState([
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const { Option } = Select;

  // Get Orders
  const getOrders = async () => {
    try {
      const res = await axios.get("/api/v1/auth/all-orders");
      setOrders(res.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Update Order Status (unused data removed)
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/payment-status/${orderId}`, {
        paymentStatus: value,
      });

      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Orders Data"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>

          {orders?.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders?.map((order, i) => (
              <div className="admin-order-card mb-4" key={order._id}>
                <div className="order-header">
                  <div>
                    <h4>📦 Order #{i + 1}</h4>
                    <small>{moment(order.createdAt).fromNow()}</small>
                  </div>

                  <Select
                    value={order.status}
                    onChange={(value) => handleChange(order._id, value)}
                  >
                    {status.map((s) => (
                      <Option key={s} value={s}>
                        {s}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="row mt-4">
                  <div className="col-md-3">
                    <div className="info-box">
                      <h6>Customer</h6>
                      <p>{order?.buyer?.name}</p>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="info-box">
                      <h6>Payment Status</h6>

                      <span
                        className={`badge ${
                          order.payment?.status === "Paid"
                            ? "bg-success"
                            : order.payment?.status === "Pending"
                              ? "bg-warning text-dark"
                              : order.payment?.status === "Refunded"
                                ? "bg-info"
                                : "bg-danger"
                        }`}
                      >
                        {order.payment?.status}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="info-box">
                      <h6>Method</h6>
                      <p>{order.payment?.method}</p>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="info-box">
                      <h6>Total</h6>
                      <h5 className="text-success">₹{order.totalAmount}</h5>
                    </div>
                  </div>
                </div>

                <div className="address-box mt-4">
                  <h6>Shipping Address</h6>
                  <p>
                    {order.address?.street},{order.address?.city},
                    {order.address?.state},{order.address?.postalCode}
                  </p>
                </div>

                {/* Products List */}
                <div className="container mt-3">
                  {order?.products?.map((item) => (
                    <div
                      className="row product-order-card align-items-center"
                      key={item.product?._id}
                    >
                      {/* Product Image */}
                      <div className="col-md-3 text-center">
                        <img
                          src={`${API}/api/v1/product/product-photo/${item.product?._id}`}
                          className="admin-order-img"
                          alt={item.product?.name}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="col-md-9">
                        <h5 className="fw-bold">{item.product?.name}</h5>

                        <p className="text-muted">
                          {item.product?.description
                            ? `${item.product.description.substring(0, 60)}...`
                            : "No description"}
                        </p>

                        <div className="d-flex flex-wrap gap-3 mt-2">
                          <span className="badge bg-primary">
                            Price: ₹{item.price}
                          </span>

                          <span className="badge bg-warning text-dark">
                            Qty: {item.cartQuantity}
                          </span>

                          <span className="badge bg-success">
                            Total: ₹{item.price * item.cartQuantity}
                          </span>
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
    </Layout>
  );
}

export default AdminOrders;
