import React, { useState, useEffect } from "react";
import type { Post } from "../types/post";
import type { User } from "../types/user";
import Modal from "./Modal";

import "../styles/List.css"; // CSS dosyasını buraya aktarıyoruz

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formInput, setFormInput] = useState({
    userId: "",
    title: "",
    body: "",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error("Veriler çekilemedi.");
        }

        const postsData: Post[] = await postsResponse.json();
        const usersData: User[] = await usersResponse.json();

        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (post: Post | null = null) => {
    setEditingPost(post);
    if (post) {
      setFormInput({
        userId: String(post.userId),
        title: post.title,
        body: post.body,
      });
    } else {
      setFormInput({ userId: "", title: "", body: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormInput({ userId: "", title: "", body: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id
          ? { ...post, ...formInput, userId: Number(formInput.userId) }
          : post
      );
      setPosts(updatedPosts as Post[]);
      alert("Gönderi başarıyla güncellendi (simülasyon).");
    } else {
      const newPost: Post = {
        id: Date.now(),
        userId: Number(formInput.userId),
        title: formInput.title,
        body: formInput.body,
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      alert("Gönderi başarıyla eklendi (simülasyon).");
    }
    closeModal();
  };

  const handleDelete = (postId: number) => {
    if (window.confirm("Bu gönderiyi silmek istediğinizden emin misiniz?")) {
      const remainingPosts = posts.filter((post) => post.id !== postId);
      setPosts(remainingPosts);
      alert("Gönderi başarıyla silindi (simülasyon).");
    }
  };

  const openUserModal = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return <p className="loading-message">Gönderiler yükleniyor...</p>;
  }

  if (error) {
    return <p className="error-message">Hata: {error}</p>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Gönderi Listesi</h1>
        <button onClick={() => openModal()} className="add-button">
          Yeni Gönderi Ekle
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Kullanıcı ID</th>
              <th>ID</th>
              <th>Başlık</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <a
                    href="#"
                    onClick={() => openUserModal(post.userId)}
                    className="table-link"
                  >
                    {post.userId}
                  </a>
                </td>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>
                  <button onClick={() => openModal(post)} className="edit-button">
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
          <h2>{editingPost ? "Gönderiyi Düzenle" : "Yeni Gönderi Ekle"}</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="userId">Kullanıcı ID:</label>
              <input
                type="number"
                id="userId"
                name="userId"
                value={formInput.userId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Başlık:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formInput.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="body">İçerik:</label>
              <textarea
                id="body"
                name="body"
                value={formInput.body}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingPost ? "Kaydet" : "Ekle"}
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

      <Modal isOpen={!!selectedUser} onClose={closeUserModal}>
        {selectedUser && (
          <div className="user-modal-content">
            <h2>Kullanıcı Bilgileri</h2>
            <p>
              <strong>İsim:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Kullanıcı Adı:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>E-posta:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Adres:</strong> {selectedUser.address.street}, {selectedUser.address.city}
            </p>
            <p>
              <strong>Şirket:</strong> {selectedUser.company.name}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostList;