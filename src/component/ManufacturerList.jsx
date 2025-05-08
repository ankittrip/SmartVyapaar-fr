
import React, { useState, useEffect } from 'react';
import { fetchManufacturers, fetchCategories } from '../services/api';

const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [Category, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const manufacturersData = await fetchManufacturers({ page: 1, limit: 5 });
        setManufacturers(manufacturersData.manufacturers);
        
        const categoriesData = await fetchCategories();
        setCategories(categoriesData.categories);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {manufacturers.map(manufacturer => (
          <li key={manufacturer._id}>{manufacturer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManufacturerList;
