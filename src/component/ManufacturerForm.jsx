import React, { useState } from "react";
import axios from "axios";

const ManufacturerForm = () => {
  const [manufacturer, setManufacturer] = useState({
    name: "",
    category: "",
    city: "",
    products: [{ name: "", price: "" }],
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, index, field) => {
    if (field === "manufacturer") {
      setManufacturer({ ...manufacturer, [e.target.name]: e.target.value });
    } else {
      const newProducts = [...manufacturer.products];
      newProducts[index][field] = e.target.value;
      setManufacturer({ ...manufacturer, products: newProducts });
    }
  };

  const addProductField = () => {
    setManufacturer({
      ...manufacturer,
      products: [...manufacturer.products, { name: "", price: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let product of manufacturer.products) {
      if (isNaN(product.price) || product.price <= 0) {
        setMessage("Please provide valid product prices.");
        return;
      }
    }

    setIsLoading(true);
    setMessage("Submitting...");
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/manufacturers`,
        manufacturer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setManufacturer({
        name: "",
        category: "",
        city: "",
        products: [{ name: "", price: "" }],
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">Add Manufacturer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={manufacturer.name}
          onChange={(e) => handleChange(e, 0, "manufacturer")}
          placeholder="Name"
          className="w-full border p-2"
          required
        />
        <input
          name="category"
          value={manufacturer.category}
          onChange={(e) => handleChange(e, 0, "manufacturer")}
          placeholder="Category"
          className="w-full border p-2"
          required
        />
        <input
          name="city"
          value={manufacturer.city}
          onChange={(e) => handleChange(e, 0, "manufacturer")}
          placeholder="City"
          className="w-full border p-2"
          required
        />

        <h3 className="font-semibold mt-4">Products</h3>
        {manufacturer.products.map((product, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleChange(e, idx, "name")}
              className="flex-1 border p-2"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleChange(e, idx, "price")}
              className="w-28 border p-2"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProductField}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Product
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p className="mt-2 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ManufacturerForm;
