import { useState } from 'react';
import styles from './audiomodal.module.css'
const categories = ['Music', 'Podcast', 'Audiobook', 'Speech', 'Others'];

const AudioModal = ({ onClose, onCreate }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [audioFile, setAudioFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && category && audioFile) {
      // Create new audio object
      const newAudio = {
        name: audioFile.name,
        description,
        category,
        file: audioFile
      };
      onCreate(newAudio); // Pass the new audio object back to parent
      onClose(); // Close the modal
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles["modalContent"]}>
        <h2>Create New Audio</h2>
        <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description:</label>
          <input
            className={styles.input}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category:</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label  className={styles.label}>Upload Audio:</label>
          <input
            type="file"
            accept=".mp3"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
          />
          
        </div>
          <button className={styles.cancelButton} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.createButton} type="submit">Create Audio</button>
        </form>
      </div>
    </div>
  );
};

export default AudioModal;
