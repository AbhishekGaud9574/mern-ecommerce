import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import "../css/Search.css";
import { API } from "./../axiosSetup";

function Search() {
  const [values] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
          : item,
      );

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return toast.success("Cart quantity updated");
    }

    const updatedCart = [...cart, { ...product, cartQuantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to Cart");
  };

  return (
    <Layout title={"Search Results"}>
      <div className="container search-page">
        <div className="text-center">
          <h1 className="search-title">Search Results</h1>

          <h6 className="search-subtitle">
            {values?.results?.length < 1
              ? "No Products Found"
              : `Found ${values.results.length} Product(s)`}
          </h6>

          <div className="row mt-4">
            {values?.results?.length ? (
              values.results.map((p) => (
                <div className="col-md-4 col-lg-3 mb-3" key={p._id}>
                  <div className="card search-card h-100">
                    <div className="product-img-container">
                      <img
                        src={`${API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        onError={(e) => {
                          e.target.src = "/images/no-image.png";
                        }}
                      />

                      {p.quantity <= 0 && (
                        <div className="out-of-stock-overlay">OUT OF STOCK</div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>

                      <p className="card-text flex-grow-1">
                        {p.description
                          ? `${p.description.substring(0, 30)}...`
                          : "No description"}
                      </p>

                      <p className="search-price">
                        ${Number(p.price).toFixed(2)}
                      </p>

                      <div className="search-btns">
                        <button
                          className="btn btn-primary"
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
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-result">No products available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Search;
