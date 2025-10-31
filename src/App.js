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

      if (response.ok) { // <-- THIS IS THE FIX
        const data = await response.json();
        setItems(data); // This is now safe
      } else {
        // If the server sends a 500 error, log it and set items to an empty array
        console.error("Failed to fetch items:", await response.json());
        setItems([]);
      }
    } catch (error) {
      // This catches network errors (like if the backend is down)
      console.error("Error fetching items:", error);
      setItems([]);
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // --- THIS IS THE FIX ---
    // We now send the "newItem" in the 'body' as JSON,
    // not in the URL.
    const response = await fetch(`${API_URL}/items/`, { // <-- URL no longer has ?name=
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem })  // <-- Send data in the body
    });
    // --- END OF FIX ---

    if (response.ok) {
      setNewItem("");
      fetchItems(); // Refresh the list
    } else {
      console.error("Failed to create item:", await response.json());
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