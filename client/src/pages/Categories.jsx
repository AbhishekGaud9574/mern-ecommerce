import Layout from "../components/Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

function Categories() {
  const categories = useCategory();

  return (
    <Layout title="All Categories">
      <div className="container py-5">
        <h2 className="text-center mb-4">All Categories</h2>

        <div className="row">
          {categories.map((c) => (
            <div className="col-md-4 mb-4" key={c._id}>
              <div className="card shadow-sm text-center p-4">
                <h4>{c.name}</h4>

                <Link
                  to={`/category/${c.slug}`}
                  className="btn btn-primary mt-3"
                >
                  View Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Categories;
