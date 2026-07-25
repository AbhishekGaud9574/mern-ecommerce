import Layout from "../components/Layout/Layout";
import { useState } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useProducts } from "../context/ProductContext";

function CartPage() {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { refreshProducts } = useProducts();

  const address = auth?.user?.address;

  const [addressError, setAddressError] = useState("");

  const handleCOD = async () => {
    if (!auth?.token) {
      toast.error("Please login first");
      return;
    }

    if (
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.postalCode
    ) {
      toast.error("Please update your address");
      navigate("/dashboard/user/profile");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/v1/auth/orders/cod",
        {
          cart,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (data.success) {
        toast.success("Order placed successfully");

        await refreshProducts();

        setCart([]);
        localStorage.removeItem("cart");

        navigate("/dashboard/user/orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
    }
  };

  const removeCartItem = (pid) => {
    const updatedCart = cart.filter((item) => item._id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (pid) => {
    const updatedCart = cart.map((item) => {
      if (item._id === pid) {
        if ((item.quantity || 1) >= item.quantityInStock) {
          toast.error("Stock limit reached");
          return item;
        }

        return {
          ...item,
          quantity: (item.quantity || 1) + 1,
        };
      }

      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (pid) => {
    const updatedCart = cart.map((item) => {
      if (item._id === pid) {
        return {
          ...item,
          quantity: Math.max(1, (item.quantity || 1) - 1),
        };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0,
    );

    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center mb-3">
          Hello {auth?.user?.name || "Guest"}
        </h2>

        <div className="row">
          {/* Products */}
          <div className="col-md-8">
            {cart?.length > 0 ? (
              cart.map((p) => (
                <div className="card cart-item" key={p._id}>
                  <div className="row g-0 align-items-center">
                    <div className="col-4 col-md-3 text-center p-3">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="cart-product-img"
                        style={{
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div className="col-8 col-md-9">
                      <div className="card-body">
                        <h5 className="fw-bold">{p.name}</h5>

                        <p className="text-muted mb-2">
                          {p.description.substring(0, 70)}...
                        </p>

                        <h4 className="cart-price">₹ {p.price}</h4>

                        <small className="stock text-success">
                          {p.quantityInStock > 1 ? "In Stock" : "Out of Stock"}
                        </small>

                        <div className="quantity-box">
                          <button
                            className="qty-btn"
                            disabled={p.quantity <= 1}
                            onClick={() => decreaseQty(p._id)}
                          >
                            −
                          </button>

                          <span className="qty-number">{p.quantity}</span>

                          <button
                            className="qty-btn"
                            disabled={p.quantity >= p.quantityInStock}
                            onClick={() => increaseQty(p._id)}
                          >
                            +
                          </button>
                        </div>

                        <div className="mt-3">
                          <button
                            className="remove-btn"
                            onClick={() => removeCartItem(p._id)}
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3>Your cart is empty</h3>
            )}
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card order-summery shadow">
              <div className="card-body">
                <h4>Order Summary</h4>

                <hr />

                <div className="d-flex justify-content-between">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Fees</span>
                  <span>$0</span>
                </div>

                <hr />

                <div className="mt-3 fw-bold d-flex justify-content-between">
                  <span className="text-success">Total Amount</span>
                  <span className="text-success">{totalPrice()}</span>
                </div>

                <hr />

                <h6>Deliver To</h6>

                {address?.street ? (
                  <p className="small">
                    {address.street}
                    <br />
                    {address.city}, {address.state}
                    <br />
                    {address.postalCode}
                  </p>
                ) : (
                  <p className="text-danger">No address found</p>
                )}

                <button
                  className="btn btn-warning w-100 mb-2"
                  style={{ color: "white" }}
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  {address?.street ? "Update Address" : "Add Address"}
                </button>

                {auth?.token ? (
                  <button
                    className="btn btn-success w-100"
                    onClick={handleCOD}
                    disabled={!cart.length}
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/login")}
                  >
                    Login to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;
