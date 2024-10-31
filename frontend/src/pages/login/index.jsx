import { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';

console.log(styles)

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        // Check if username is empty
        if (!username) {
            newErrors.username = 'Username cannot be empty!';
        }

        // Check if password is empty
        if (!password) {
            newErrors.password = 'Password cannot be empty!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const login = async () => {
        await fetch("http://localhost:5000/api/login", {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                username,
                password
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Network response was not ok");
            }
        }).then(result => {
            const {token, userId} = result
            localStorage.setItem("sessionKey", token)
            localStorage.setItem("userId", userId)
            navigate('/home')

        }).catch(err => {
            console.error(err)
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (validate()) {
            await login()
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>User Audio Management System</h1>
            <div className={styles.container}>
              <h1>Login</h1>
              <form onSubmit={handleSubmit} className={styles["form-container"]}>
                  <div className={styles["form-input-container"]}>
                      <label className={styles["form-label"]}>Username</label>
                      <input
                          className={styles["form-input"]}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />
                  </div>
                  {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                  <div className={styles["form-input-container"]}>
                  <label className={styles["form-label"]}>Password</label>
                      <input
                         className={styles["form-input"]}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      
                  </div>
                  {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                  <button type="submit">Login</button>
              </form>
            </div>
        </div>
    );
};

export default Login;
