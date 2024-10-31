import React, { useEffect, useState } from 'react';
import styles from './usermodal.module.css'; // Assuming you have a CSS module for styling

const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (username.length < 4) newErrors.username = 'Username must be at least 4 characters.';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onCreate({ username, password, role });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setUsername("")
      setPassword("")
      setRole("USER")
    }
  }, [isOpen])

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className={styles.error}>{errors.username}</p>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
            <button className={styles.createButton} type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default CreateUserModal;