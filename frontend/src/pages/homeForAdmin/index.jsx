import { useEffect, useState } from "react"
import styles from './homeAdmin.module.css'
import CreateUserModal from "../../component/CreateUserModal"
import UpdateUserModal from "../../component/UpdateUserModal"
const HomeForAdmin = ({currentUser, updateName}) => {
  const [users, setUsers] = useState([])
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState()
  const sessionKey = localStorage.getItem("sessionKey")

  const fetchUsers = async() => {
    await fetch("http://localhost:5000/api/users", {
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${sessionKey}`},
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Network response was not ok")
      }
    }).then(result => {
      setUsers(result)
    }).catch(err => {
      console.error(err)
    })
  }
  
  useEffect(() => {
    fetchUsers()
  }, [])


  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        fetchUsers()
      } else {
        console.error("Failed to create new user")
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        fetchUsers()
        if (userData.id === currentUser.id) {
          updateName(userData.username)
        }
      } else {
        console.error("Failed to update user")
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  const closeUpdateModal = () => {
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  };

  const deleteUser = async (user) => {
    const {id} = user
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionKey}`
        },
      })
      if (response.ok) {
        fetchUsers()
      } else {
        console.error("Failed to delete user")
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <>
      <h2>Users on Platform</h2>
      <button className={styles.button + ' ' + styles["add-button"]} onClick={() => setModalOpen(true)}>Create User</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user?.username}</td>
              <td>{'*'.repeat(8)}</td>
              <td>{user?.role}</td>
              <td className={styles["action-buttons"]}>
                <button className={styles.button + ' ' + styles["edit-button"]} onClick={() => {
                  setSelectedUser(user)
                  setIsUpdateModalOpen(true)
                }}>Edit</button>
                <button className={styles.button  + ' ' + styles["delete-button"]} onClick={() => deleteUser(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={handleCreateUser} 
      />
      {isUpdateModalOpen &&<UpdateUserModal  
        user={selectedUser} 
        onClose={closeUpdateModal} 
        onUpdate={handleUpdateUser} 
      />}
    </>
  )

}

export default HomeForAdmin