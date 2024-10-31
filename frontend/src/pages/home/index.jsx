import { retrieveUserDetails } from "../../hooks"
import HomeForAdmin from "../homeForAdmin"
import styles from './home.module.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import HomeForUser from "../homeForUser";

const Home = () => {
  const userDetails = retrieveUserDetails()

  const navigate = useNavigate();

  const [name, setName] = useState("")

  useEffect(() => {
    setName(userDetails?.username)
  }, [userDetails])

  const handleLogout = () => {
    localStorage.removeItem('sessionKey');
    navigate('/login');
  };

  const updateName = (newName) => {
    setName(newName)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.welcomeText}>Welcome {name}</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.container}>
        {userDetails?.role === "ADMIN" ? <HomeForAdmin currentUser={userDetails} updateName={updateName}/> : <HomeForUser currentUser={userDetails}/>}
      </div>
    </div>
  
  )
}

export default Home