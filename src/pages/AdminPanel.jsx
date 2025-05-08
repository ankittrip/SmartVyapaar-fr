import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', city: '', products: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  const fetchManufacturers = async () => {
    const res = await axios.get(`${API}/api/manufacturers`);
    setManufacturers(res.data.manufacturers || []);
  };

  const handleCreate = async () => {
    const products = formData.products
      .split(',')
      .map(p => {
        const [name, price] = p.split('-');
        if (!name || !price) return null;
        return { name: name.trim(), price: parseFloat(price.trim()) };
      })
      .filter(Boolean);

    await axios.post(`${API}/api/manufacturers`, { ...formData, products }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setFormData({ name: '', category: '', city: '', products: '' });
    fetchManufacturers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/manufacturers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchManufacturers();
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${API}/api/manufacturers/${id}`);
      const manufacturer = res.data.manufacturer || res.data;

      const productsArray = Array.isArray(manufacturer.products) ? manufacturer.products : [];

      const newName = prompt('Enter new name:', manufacturer.name);
      const newCategory = prompt('Enter new category:', manufacturer.category);
      const newCity = prompt('Enter new city:', manufacturer.city);
      const newProductsRaw = prompt(
        'Enter new products (name-price, comma separated):',
        productsArray.map(p => `${p.name}-${p.price}`).join(', ')
      );

      if (!newName || !newCategory || !newCity || !newProductsRaw) {
        alert('All fields are required.');
        return;
      }

      const products = newProductsRaw
        .split(',')
        .map(p => {
          const [name, price] = p.split('-');
          if (!name || !price) return null;
          return { name: name.trim(), price: parseFloat(price.trim()) };
        })
        .filter(Boolean);

      if (!products.length) {
        alert('Products must not be empty or invalid.');
        return;
      }

      const updatedManufacturer = {
        name: newName,
        category: newCategory,
        city: newCity,
        products,
      };

      await axios.put(`${API}/api/manufacturers/${id}`, updatedManufacturer, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchManufacturers();
    } catch (error) {
      console.error('Failed to edit manufacturer:', error.response?.data || error.message);
      alert('Failed to edit manufacturer. Check console for details.');
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const filteredManufacturers = manufacturers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-green-500">Admin Panel</h1>

      <h2 className="text-xl font-bold mb-4">Manage Manufacturers Details</h2>
      <h3>SEARCH</h3>


      <input
        type="text"
        placeholder="Search by name or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-1/2 mb-4"
      />
      <h3>Add Manufacturers </h3>

      <input
        placeholder="Name" value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="border p-1 w-full mb-2"
      />
      <input
        placeholder="Category" value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value })}
        className="border p-1 w-full m-4"
      />
      <input
        placeholder="City" value={formData.city}
        onChange={e => setFormData({ ...formData, city: e.target.value })}
        className="border p-1 w-full mb-2"
      />
      <input
        placeholder="Products (name-price, comma separated)" value={formData.products}
        onChange={e => setFormData({ ...formData, products: e.target.value })}
        className="border p-1 w-full mb-2"
      />
      <button onClick={handleCreate} className="bg-blue-800 text-white px-4 py-1 rounded mb-4">
        Add Manufacturer
      </button>


      <ul>
        {filteredManufacturers.length > 0 ? (
          filteredManufacturers.map((m) => (
            <li key={m._id} className="border-b py-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm">{m.category}, {m.city}</p>
                <p className="text-sm text-gray-600">
                  {(m.products || []).map(p => `${p.name} - ₹${p.price}`).join(', ')}
                </p>
              </div>
              <div>
                <button onClick={() => handleEdit(m._id)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(m._id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No manufacturers found matching your search.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminPanel;
