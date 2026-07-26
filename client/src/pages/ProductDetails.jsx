import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { API } from "../axiosSetup";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(true);

  // ==============================
  // Fetch Related Products
  // ==============================
  const fetchRelatedProducts = useCallback(async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${productId}/${categoryId}`,
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }, []);

  // ==============================
  // Fetch Product Details
  // ==============================
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/get-product/${slug}`);

      if (data?.success) {
        setProduct(data?.product);
        fetchRelatedProducts(data?.product._id, data?.product.category._id);
      } else {
        toast.error("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  }, [slug, fetchRelatedProducts]);

  // ==============================
  // useEffect
  // ==============================
  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    }
  }, [slug, fetchProductDetails]);

  // ==============================
  // Add To Cart
  // ==============================
  const handleAddToCart = (p) => {
    if (p.quantity <= 0) {
      toast.error("Out of Stock");
      return;
    }

    const alreadyExist = cart.find((item) => item._id === p._id);

    if (alreadyExist) {
      toast.error("Product already in cart");
      return;
    }

    const product = {
      ...p,
      quantity: 1,
      quantityInStock: p.quantity,
    };

    const updatedCart = [...cart, product];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to Cart");
  };

  // ==============================
  // Loading UI
  // ==============================
  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mt-4 text-center">
          <h2>Loading product details...</h2>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="container mt-4 text-center">
          <h2>Product not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Product Details">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="product-details-img"
            />
          </div>

          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h4>Price: ₹{product.price}</h4>
            <h5>Category: {product?.category?.name}</h5>

            {product.quantity > 0 ? (
              cart.some((item) => item._id === product._id) ? (
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/cart")}
                >
                  <i className="fa-solid fa-cart-arrow-down me-2"></i>
                  Go to Cart
                </button>
              ) : (
                <button
                  className="btn btn-dark"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="fa-solid fa-cart-shopping me-2"></i>
                  Add to Cart
                </button>
              )
            ) : (
              <button className="btn btn-danger" disabled>
                <i className="fa-solid fa-circle-xmark me-2"></i>
                Out of Stock
              </button>
            )}
          </div>
        </div>

        <hr />

        <div className="row mt-4">
          <h3>Related Products</h3>
          <div className="d-flex flex-wrap">
            {relatedProducts?.length ? (
              relatedProducts.map((p) => (
                <div
                  key={p._id}
                  className="card m-2"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                    className="product-details-img"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5>{p.name}</h5>
                    <p>{p.description.substring(0, 60)}...</p>
                    <p>$ {p.price}</p>

                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
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
              ))
            ) : (
              <p>No related products found</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetails;
