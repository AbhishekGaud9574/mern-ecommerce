import React, { useState, useEffect, useCallback } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "./../../axiosSetup";
import "../../css/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all products
  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data?.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [page]);

  // Get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial load
  useEffect(() => {
    getTotal();
    getAllProducts();
  }, []);

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      const { data } = await axios.get(
        `/api/v1/product/product-list/${nextPage}`,
      );
      setLoading(false);

      if (data?.products) {
        setProducts((prev) => [...prev, ...data.products]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more products:", error.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3 sidebar">
          <AdminMenu />
        </div>

        <div className="col-md-9 content-area">
          <h1 className="text-center">All Products ({total})</h1>

          <div className="d-flex flex-wrap">
            {products.length > 0 ? (
              products.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="card m-4">
                    <img
                      src={`${API}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="card-img-top"
                      onError={(e) => {
                        e.target.src = "/images/no-image.png";
                      }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate" title={p.name}>
                        {p.name}
                      </h5>

                      <h6 className="text-success">${p.price}</h6>

                      <p className="card-text">
                        {p.description
                          ? `${p.description.substring(0, 30)}...`
                          : "No description"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center w-100">No products available</p>
            )}
          </div>

          <div className="m-2 p-3 text-center">
            {products.length < total && (
              <button
                className="btn btn-dark"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Products;
