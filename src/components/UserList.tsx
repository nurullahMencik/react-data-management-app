import React, { useState, useEffect } from "react";
import type { User } from "../types/user";
import Modal from "./Modal";

import "../styles/List.css";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formInput, setFormInput] = useState({
    name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error("Kullanıcı verileri çekilemedi.");
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    if (user) {
      setFormInput({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    } else {
      setFormInput({ name: "", username: "", email: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormInput({ name: "", username: "", email: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...formInput } : user
      );
      setUsers(updatedUsers as User[]);
      alert("Kullanıcı başarıyla güncellendi (simülasyon).");
    } else {
      const newUser: User = {
        id: Date.now(),
        ...formInput,
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: { lat: "", lng: "" },
        },
        phone: "",
        website: "",
        company: { name: "", catchPhrase: "", bs: "" },
      };
      setUsers((prevUsers) => [newUser, ...prevUsers]);
      alert("Kullanıcı başarıyla eklendi (simülasyon).");
    }
    closeModal();
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      const remainingUsers = users.filter((user) => user.id !== userId);
      setUsers(remainingUsers);
      alert("Kullanıcı başarıyla silindi (simülasyon).");
    }
  };

  if (loading) {
    return <p>Kullanıcılar yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error}</p>;
  }

  return (
    <div className="list-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5em",
        }}
      >
        <h1>Kullanıcı Listesi</h1>
        <button onClick={() => openModal()} className="add-button">
          Yeni Kullanıcı Ekle
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => openModal(user)} className="edit-button">
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete-button"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>İsim:</label>
            <input
              type="text"
              name="name"
              value={formInput.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Kullanıcı Adı:</label>
            <input
              type="text"
              name="username"
              value={formInput.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>E-posta:</label>
            <input
              type="email"
              name="email"
              value={formInput.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">{editingUser ? "Kaydet" : "Ekle"}</button>
          <button
            type="button"
            onClick={closeModal}
            style={{ marginLeft: "10px" }}
          >
            İptal
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
