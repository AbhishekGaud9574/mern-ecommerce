import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

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
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>

          <h6>
            {values?.results?.length < 1
              ? "No Products Found"
              : `Found ${values.results.length} Product(s)`}
          </h6>

          <div className="row mt-4">
            {values?.results?.length ? (
              values.results.map((p) => (
                <div className="col-md-4 col-lg-3 mb-3" key={p._id}>
                  <div className="card h-100">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{
                        height: "250px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/images/no-image.png";
                      }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>

                      <p className="card-text flex-grow-1">
                        {p.description
                          ? `${p.description.substring(0, 30)}...`
                          : "No description"}
                      </p>

                      <p className="card-text text-success fw-bold">
                        ${Number(p.price).toFixed(2)}
                      </p>

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          View Details
                        </button>

                        <button
                          className="btn btn-dark"
                          onClick={() => handleAddToCart(p)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No products available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Search;
