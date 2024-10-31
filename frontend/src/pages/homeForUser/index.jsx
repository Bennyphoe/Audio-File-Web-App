import { useEffect, useState } from 'react';
import AudioModal from '../../component/AudioModal';
import styles from './homeUser.module.css'

const HomeForUser = ({currentUser}) => {
  const [audios, setAudios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sessionKey = localStorage.getItem("sessionKey")

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchAudios = async() => {
    await fetch(`http://localhost:5000/api/audios/users/${currentUser.id}`, {
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${sessionKey}`},
      
      method: "GET"
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Error fetching audios")
      }
    }).then(result => {
      setAudios(result)
    }).catch(err => console.error(err))
  }

  useEffect(() => {
    if (currentUser) {
      fetchAudios()
    }
  }, [currentUser])

  const handleCreateAudio = async(newAudio) => {
    const formData = new FormData()
    formData.append("userId", currentUser.id)
    formData.append("name", newAudio.name)
    formData.append("description", newAudio.description)
    formData.append("category", newAudio.category)
    formData.append("audio", newAudio.file)
    await fetch("http://localhost:5000/api/audios", {
      headers: {
        "Authorization": `Bearer ${sessionKey}`, 
      },
      method: "POST",
      body: formData
    }).then(response => {
      if (response.ok) {
        fetchAudios()
      } else {
        throw new Error("Failed to upload Audio")
      }
    }).then(result => result).catch(err => console.error(err))
  };

  const handleDeleteAudio = async(id) => {
    await fetch(`http://localhost:5000/api/audios/${id}`, {
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${sessionKey}`},
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        fetchAudios()
      } else {
        throw new Error("Error deleting audio")
      }
    }).catch(err => console.error(err))
  }

  return (
    <div className={styles["audio-management"]}>
      <h1>Audio Management</h1>
      <button onClick={openModal}>Add New Audio</button>

      {isModalOpen && (
        <AudioModal onClose={closeModal} onCreate={handleCreateAudio} />
      )}

      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Play</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audios.length === 0 ? (
            <tr>
              <td colSpan="5">No audio found</td>
            </tr>
          ) : (
            audios.map((audio) => (
              <tr key={audio.id}>
                <td>{audio.name}</td>
                <td>{audio.description}</td>
                <td>{audio.category}</td>
                <td>
                  <audio controls src={audio.url}>
                    Your browser does not support the audio element.
                  </audio>
                </td>
                <td>
                  <button className={styles.dangerButton} onClick={() => handleDeleteAudio(audio.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HomeForUser;
