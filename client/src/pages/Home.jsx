import Layout from "../components/Layout/Layout";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { useProducts } from "../context/ProductContext";
import { Prices } from "../components/Prices";
import { API } from "../axiosSetup";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  const { products, setProducts, refreshProducts } = useProducts();
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isAdmin = auth?.user?.role === 1;

  // ==============================Get All Categories==============================
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ==============================Get Total Products Count==============================
  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ==============================Load More Products==============================
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      if (data?.success) {
        setProducts((prev) => {
          const ids = new Set(prev.map((p) => p._id));

          return [...prev, ...data.products.filter((p) => !ids.has(p._id))];
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page, setProducts]);

  // ==============================Filter Products==============================
  const filterProduct = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.error(error);
    }
  }, [checked, radio, setProducts]);

  // ==============================Initial Load==============================
  useEffect(() => {
    getAllCategory();
    getTotal();
    refreshProducts();
  }, [getAllCategory, getTotal, refreshProducts]);

  // ==============================Pagination Effect==============================
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore, setProducts]);

  // ==============================Filter Effect==============================
  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio, filterProduct]);

  // ==============================Handle Category Filter==============================
  const handleFilter = (value, id) => {
    let updated = value ? [...checked, id] : checked.filter((c) => c !== id);
    setChecked(updated);
  };

  // ==============================Add To Cart==============================
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
    <Layout title={"All Products - Best Offers"}>
      <div className="row mt-3">
        {/* ================= FILTER SECTION ================= */}
        <div className="col-md-2">
          <h4>Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                checked={checked.includes(c._id)}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          <h4 className="mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <div>
              <Radio.Group
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                className="d-flex flex-column"
              >
                {Prices?.map((p) => (
                  <Radio key={p._id} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>

          <div className="reset-filters">
            <button
              className="btn btn-danger mt-3"
              onClick={async () => {
                setChecked([]);
                setRadio([]);
                setPage(1);
                await refreshProducts();
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* ================= PRODUCT SECTION ================= */}
        <div className="col-md-9">
          {/* ===== SLIDER (UNCHANGED) ===== */}
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
              ></button>
            </div>

            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="/images/slider3.webp"
                  className="d-block w-100"
                  alt="Slide 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/images/slider4.jpg"
                  className="d-block w-100"
                  alt="Slide 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="/images/slider1.webp"
                  className="d-block w-100"
                  alt="Slide 3"
                />
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>

          <h1 className="text-center mt-3 home-title">All Products</h1>

          <div className="row g-4 justify-content-center">
            {products?.length ? (
              products.map((p) => (
                <div
                  key={p._id}
                  className="col-12 col-sm-6 col-lg-6 col-xl-4 col-xxl-3"
                >
                  <div className="card home-card h-100">
                    <div className="product-img-container">
                      <img
                        src={`${API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top home-card-img"
                        alt={p.name}
                      />

                      {p.quantity <= 0 && (
                        <div className="out-of-stock-overlay">OUT OF STOCK</div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5>{p.name}</h5>

                      <p>{p.description.substring(0, 60)}...</p>

                      <h5 className="text-success mb-3">$ {p.price}</h5>

                      {!isAdmin && (
                        <div className="d-flex gap-2 mt-auto">
                          <button
                            className={`btn btn-primary ${
                              p.quantity > 0 ? "" : "w-100"
                            }`}
                            onClick={() => navigate(`/product/${p.slug}`)}
                          >
                            View Details
                          </button>

                          {p.quantity > 0 &&
                            (cart.some((item) => item._id === p._id) ? (
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
                                onClick={() => handleAddToCart(p)}
                              >
                                <i className="fa-solid fa-cart-shopping me-2"></i>
                                Add to Cart
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>

          {!checked.length && !radio.length && products.length < total && (
            <button
              className="btn btn-dark load-more-btn"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
