import { useNavigate } from "react-router-dom";
import styles from './notfound.module.css'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["not-found-container"]}>
      <h2 className={styles["not-found-title"]}>404 - Page Not Found</h2>
      <p className={styles["not-found-message"]}>Sorry, the page you are looking for does not exist.</p>
      <button className={styles["not-found-button"]} onClick={() => navigate("/")}>
        Return Home
      </button>
    </div>
  );
}

export default NotFound