import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image");
    }

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size should be less than 2MB");
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message,
      );
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create product function with validation
  const handleCreate = async (e) => {
    e.preventDefault();

    // Input validation
    if (!name || !description || !price || !quantity || !category || !photo) {
      return toast.error("All fields are required, including photo!");
    }

    if (Number(price) <= 0) {
      return toast.error("Price must be greater than 0");
    }

    if (Number(quantity) < 0) {
      return toast.error("Invalid quantity");
    }

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", Number(price));
      productData.append("quantity", Number(quantity));
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      // Await for Axios response
      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData,
      );

      if (data?.success) {
        toast.success("Product created successfully");

        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setShipping("");
        setPhoto(null);
        setPreview("");

        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  return (
    <Layout title="Dashboard - Create Product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <form className="m-1 w-75" onSubmit={handleCreate}>
              {/* Category Selector */}
              <Select
                variant={false}
                placeholder="Select a Category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
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
                    accept="image/*"
                    hidden
                    onChange={handlePhoto}
                  />
                </label>
              </div>

              {/* Display Selected Photo */}
              {photo && (
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="preview"
                    height="200"
                    className="img-fluid rounded"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Name Input */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Enter product name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description Input */}
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Enter product description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price Input */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Enter product price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity Input */}
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Enter product quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Shipping Selector */}
              <div className="mb-3">
                <Select
                  variant={false}
                  size="large"
                  placeholder="Select shipping option"
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </div>

              {/* Create Product Button */}
              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  CREATE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateProduct;
