import React, { useState, useEffect } from 'react';

// This is the magic! Vercel will inject this environment variable.
// Make sure to prefix it with REACT_APP_
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState("");

  const fetchMessage = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMessage(data.Hello);
    } catch (error) {
      setMessage("Could not connect to API");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/items/`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchMessage();
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/items/?name=${newItem}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setNewItem("");
        fetchItems(); // Refresh the list
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + FastAPI + Cloud SQL</h1>
      <h2>API says: "{message}"</h2>

      <hr />

      <h3>Items in Database:</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} (ID: {item.id})</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item name"
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default App;