import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ManufacturerDetail = () => {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://smartvyapaar-a.onrender.com/api/manufacturers/${id}`)
      .then((res) => {
        setManufacturer(res.data.manufacturer);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load manufacturer details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!manufacturer) return <p className="text-center">No manufacturer found.</p>;

  return (
    <div className="ManufacturerDetail">
      <div className="card p-4 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <h1>Manufacturer Details</h1>

        <h2>{manufacturer.name}</h2>
        <p><strong>Category:</strong> {manufacturer.category}</p>
        <p><strong>City:</strong> {manufacturer.city}</p>

        <h3 className="mt-4">Products</h3>
        {manufacturer.products.length === 0 ? (
          <p>No products available for this manufacturer.</p>
        ) : (
          <ul className="products-list">
            {manufacturer.products.map((p, i) => (
              <li key={i}>
                <span>{p.name}</span> - ₹{new Intl.NumberFormat("en-IN").format(p.price)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center mt-4">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
};

export default ManufacturerDetail;
