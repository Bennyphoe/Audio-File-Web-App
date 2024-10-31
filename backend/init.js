const bcrypt = require('bcrypt');

const initData = async(pool) => {
  const createUserTable = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
  )`

  const createAudioTable = `CREATE TABLE IF NOT EXISTS audios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    s3_key VARCHAR(255) NOT NULL
  )`

  const defaultAdminPassword = "password"
  const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10)
  const adminExistsQuery = `SELECT * FROM users WHERE username = 'admin'`; 
  const createInitialAdmin =  `INSERT INTO users (username, password, role) VALUES ('admin', '${hashedPassword}', 'ADMIN')`

  try {
    await pool.query(createUserTable)
    console.log("Created user table or table already exists")
    await pool.query(createAudioTable)
    console.log("Created audio table or table already exists")
    const adminExistsResult = await pool.query(adminExistsQuery);
    if (adminExistsResult.rows.length === 0) {
      await pool.query(createInitialAdmin)
      console.log("Created Default Admin")
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {initData}