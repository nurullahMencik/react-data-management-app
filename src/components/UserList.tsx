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
    return <p className="loading-message">Kullanıcılar yükleniyor...</p>;
  }

  if (error) {
    return <p className="error-message">Hata: {error}</p>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Kullanıcı Listesi</h1>
        <button onClick={() => openModal()} className="add-button">
          Yeni Kullanıcı Ekle
        </button>
      </div>

      <div className="table-container">
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
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="form-modal-content">
          <h2>{editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="name">İsim:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formInput.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Kullanıcı Adı:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formInput.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-posta:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formInput.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingUser ? "Kaydet" : "Ekle"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="cancel-button"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;