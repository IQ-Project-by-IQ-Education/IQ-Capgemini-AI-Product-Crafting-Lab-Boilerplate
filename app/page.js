"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(null); // person being edited

  // Load everyone from the database
  function load() {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }

  useEffect(load, []);

  // Add a new person
  function add(e) {
    e.preventDefault();
    if (!name.trim()) return;
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    }).then(() => {
      setName("");
      setEmail("");
      load();
    });
  }

  // Save an edit
  function save(id) {
    fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name, email: editing.email }),
    }).then(() => {
      setEditing(null);
      load();
    });
  }

  // Delete a person
  function remove(id) {
    fetch(`/api/users/${id}`, { method: "DELETE" }).then(load);
  }

  return (
    <div className="page">
      <h1>My CRM</h1>
      <p className="sub">{users.length} people in your SQLite database (app.db)</p>

      <form className="add" onSubmit={add}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add person</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              {editing?.id === u.id ? (
                <>
                  <td>
                    <input
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editing.email || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, email: e.target.value })
                      }
                    />
                  </td>
                  <td>{u.created_at}</td>
                  <td className="actions">
                    <button onClick={() => save(u.id)}>Save</button>
                    <button className="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td className="actions">
                    <button className="ghost" onClick={() => setEditing(u)}>
                      Edit
                    </button>
                    <button className="danger" onClick={() => remove(u.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
