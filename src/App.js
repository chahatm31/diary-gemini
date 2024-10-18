// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ text: "", tags: [] });
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    // Load entries from local storage on component mount
    const storedEntries = localStorage.getItem("entries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    // Save entries to local storage whenever entries array changes
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const handleLogin = () => {
    // In a real app, you would authenticate against a server here
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, text: e.target.value });
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setNewEntry({ ...newEntry, tags });
  };

  const addEntry = () => {
    if (newEntry.text.trim() !== "") {
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
      setNewEntry({ text: "", tags: [] });
    }
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({ text: entry.text, tags: entry.tags });
  };

  const updateEntry = () => {
    setEntries(
      entries.map((entry) =>
        entry.id === editingEntry.id ? { ...newEntry, id: entry.id } : entry
      )
    );
    setNewEntry({ text: "", tags: [] });
    setEditingEntry(null);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="app-container">
      <h1>My Diary App</h1>
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <h2>New Entry</h2>
          <textarea
            value={newEntry.text}
            onChange={handleEntryChange}
            placeholder="Write your entry here..."
          />
          <input
            type="text"
            value={newEntry.tags.join(", ")}
            onChange={handleTagChange}
            placeholder="Add tags (comma-separated)"
          />
          {editingEntry ? (
            <button onClick={updateEntry}>Update Entry</button>
          ) : (
            <button onClick={addEntry}>Add Entry</button>
          )}

          <h2>Entries</h2>
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <h3>
                  {entry.text}
                  <span className="tag-list">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                </h3>
                <button onClick={() => editEntry(entry)}>Edit</button>
                <button onClick={() => deleteEntry(entry.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
