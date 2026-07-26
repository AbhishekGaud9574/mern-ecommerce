import { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "./../../axiosSetup";
import "../../css/UpdateProduct.css";

const { Option } = Select;

function UpdateProduct() {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get Single Product (useCallback to fix ESLint warning)
  const getSingleProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );

      if (data?.success) {
        const product = data.product;

        setName(product.name);
        setId(product._id);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
        setShipping(product.shipping ? "1" : "0");
        setCategory(product.category._id);

        setPreview(`${API}/api/v1/product/product-photo/${product._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }, [params.slug]);

  useEffect(() => {
    getSingleProduct();
  }, [getSingleProduct]);

  // Get All Categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  }, []);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !quantity ||
      !category
    ) {
      return toast.error("All fields are required");
    }

    if (Number(price) <= 0) {
      return toast.error("Price must be greater than 0");
    }

    if (Number(quantity) < 0) {
      return toast.error("Quantity cannot be negative");
    }

    try {
      setLoading(true);

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);

      if (photo) {
        productData.append("photo", photo);
      }

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData,
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?",
      );

      if (!answer) return;

      setDeleteLoading(true);

      await axios.delete(`/api/v1/product/delete-product/${id}`);

      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [photo]);

  return (
    <Layout title="Dashboard - Update Product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h2 className="mb-4">Update And Delete Product</h2>

            <form className="m-1 w-75" onSubmit={handleUpdate}>
              {/* Category Select */}
              <Select
                variant="outlined"
                placeholder="Select a Category"
                size="large"
                showSearch
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Photo Upload */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file && file.size > 1000000) {
                        return toast.error("Image should be less than 1 MB");
                      }

                      setPhoto(file);
                    }}
                  />
                </label>
              </div>

              {/* Photo Preview */}
              <div className="mb-3 text-center">
                <div className="border rounded shadow-sm p-2 d-inline-block">
                  <img src={preview} alt={name} />
                </div>
              </div>

              {/* Name */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <textarea
                  rows={5}
                  className="form-control"
                  placeholder="Write a description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className="form-control"
                  placeholder="Write a price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Write a quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Shipping Select */}
              <Select
                variant="outlined"
                size="large"
                placeholder="Select Shipping"
                onChange={(value) => setShipping(value)}
                value={shipping}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              {/* Buttons */}
              <div className="d-flex gap-3 mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "UPDATE PRODUCT"}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "DELETE PRODUCT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateProduct;
