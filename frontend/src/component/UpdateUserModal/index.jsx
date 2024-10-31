import { useState } from 'react';
import styles from './updatemodal.module.css'; // Ensure you have styles defined for the modal

const UpdateUserModal = ({ user, onClose, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (username.length < 4) newErrors.username = 'Username must be at least 4 characters.';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate({
      id: user.id,
      username,
      password,
      role
    });
    onClose(); // Close the modal
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Update User</h2>
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
            <button className={styles.updateButton} type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
