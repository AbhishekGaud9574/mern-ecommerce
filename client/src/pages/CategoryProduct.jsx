import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { API } from "../axiosSetup";

function CategoryProduct() {
  const navigate = useNavigate();
  const { slug } = useParams(); //destructure here
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (!slug) return;

    const getProductByCat = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/product-category/${slug}`,
        );
        setProducts(data?.products || []);
        setCategory(data?.category || {});
      } catch (error) {
        console.log(error);
      }
    };

    getProductByCat();
  }, [slug]); // dependency properly added

  const handleAddToCart = (p) => {
    if (p.quantity <= 0) {
      toast.error("Out of Stock");
      return;
    }

    const alreadyExist = cart.find((item) => item._id === p._id);

    if (alreadyExist) {
      toast.error("Product is already in your cart");
      return;
    }

    const updatedCart = [
      ...cart,
      {
        ...p,
        quantity: 1,
        quantityInStock: p.quantity,
      },
    ];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast.success("Item Added to Cart");
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center mb-2">Category - {category?.name}</h2>
        <p className="text-center text-muted">
          {products?.length} Product(s) Found
        </p>

        <div className="row g-4">
          {products?.length ? (
            products.map((p) => (
              <div
                className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                key={p._id}
              >
                <div className="card h-100 shadow-sm">
                  <div className="product-img-container">
                    <img
                      src={`${API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        background: "#fff",
                        // padding: "12px",
                      }}
                    />

                    {p.quantity <= 0 && (
                      <div className="out-of-stock-overlay">OUT OF STOCK</div>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>

                    <p className="card-text text-muted">
                      {p.description?.length > 60
                        ? p.description.substring(0, 60) + "..."
                        : p.description}
                    </p>

                    <h5 className="text-success mb-3">
                      $ {Number(p.price).toLocaleString()}
                    </h5>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-primary w-50"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        View Details
                      </button>

                      {p.quantity > 0 &&
                        (cart.some((item) => item._id === p._id) ? (
                          <button
                            className="btn btn-success w-50"
                            onClick={() => navigate("/cart")}
                          >
                            <i className="fa-solid fa-cart-arrow-down me-2"></i>
                            Go to Cart
                          </button>
                        ) : (
                          <button
                            className="btn btn-dark w-50"
                            onClick={() => handleAddToCart(p)}
                          >
                            <i className="fa-solid fa-cart-shopping me-2"></i>
                            Add to Cart
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <h4>No Products Available</h4>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default CategoryProduct;
