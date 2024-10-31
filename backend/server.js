const { initData } = require('./init');
const bcrypt = require('bcrypt');
const { authenticateToken, authenticateAdmin } = require('./middleware')
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')
const multer = require("multer");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  accessKeyId: accessKey,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
})

const storage = multer.memoryStorage()
const upload = multer({ storage });




// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

initData(pool)

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;



//APIs for User management

//Create User
app.post('/api/users', authenticateAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  const saltRounds = 10
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    try {
      const result = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hash, role]);
      res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
});

//Retrieve all users
app.get('/api/users',  authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.status(201).json(result.rows)
  } catch(err) {
    console.error(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

//retrieve user details
app.get('/api/users/:id', authenticateToken, async(req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    const user = result.rows[0]
    res.status(201).json({
      username: user.username,
      role: user.role,
      id: user.id
    })
  } catch(err) {
    console.error(err)
    res.status(500).json({error: "Internal Server Error"})
  }
})

//Update user
app.put('/api/users/:id',  authenticateAdmin, async(req, res) => {
  const userId = req.params.id
  const { username, password, role } = req.body
  const saltRounds = 10
  let hashPassword = password
  if (password) {
    hashPassword = await bcrypt.hash(password, saltRounds)
  }

  try {
    await pool.query('UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4', [username, hashPassword, role, userId])
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})


//Delete User
app.delete('/api/users/:id',  authenticateAdmin, async(req, res) => {
  const userId = req.params.id
  try {
    const userAudiosResult = await pool.query("SELECT audios.s3_key FROM audios INNER JOIN users ON users.id = audios.user_id WHERE users.id = $1", [userId])
    const userAudios = userAudiosResult.rows
    await pool.query("DELETE FROM users WHERE id = $1", [userId])
    for (const audio of userAudios) {
      const params = {
        Bucket: bucketName,
        Key: audio.s3_key
      }
      const command = new DeleteObjectCommand(params)
      await s3.send(command)
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
})


//APIs for Login Management

//Login

app.post("/api/login", async(req, res) => {
  const { username, password } = req.body
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const token = jwt.sign({userId: user.id, role: user.role}, JWT_SECRET, {expiresIn: '1h'})
      res.json({ message: 'Login successful', token, userId: user.id });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Internal server error"})
  }
})


//APIs for Audio management

app.post("/api/audios", authenticateToken, upload.single("audio"), async(req, res) => {
    const {description, category, name, userId} = req.body
    const audioFile = req.file
    const s3_key = `${Date.now()}_${audioFile.originalname}`
    const s3Params = {
      Bucket: bucketName,
      Key: s3_key,
      Body: audioFile.buffer,
      ContentType: audioFile.mimetype,
    };
    const command = new PutObjectCommand(s3Params)
    try {
      await s3.send(command)

      const result = await pool.query("INSERT into audios (user_id, description, category, name, s3_key) VALUES ($1, $2, $3, $4, $5)", [userId, description, category, name, s3_key])
      res.status(201).json({ message: 'Audio created', audioId: result.insertId })
    } catch (err) {
      console.error(err)
      res.status(500).json({error: "Internal server error"})
    }
    
})

app.get("/api/audios/users/:id", authenticateToken, async(req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query("SELECT audios.id, audios.description, audios.category, audios.name, audios.s3_key FROM audios INNER JOIN users ON users.id = audios.user_id WHERE users.id = $1 ORDER BY audios.id", [id])
    const audios = result.rows
    for (const audio of audios) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: audio.s3_key
      }
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      audio.url = url 
    }
    res.status(200).json(audios)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Internal server error"})
  }
})

app.delete("/api/audios/:id", authenticateToken, async(req, res) => {
  const id = req.params.id
  try {
    const result = await pool.query("SELECT * FROM audios WHERE audios.id = $1", [id])
    const audio = result.rows[0]
    if (audio) {
      const s3_key = audio.s3_key
      await pool.query("DELETE FROM audios WHERE id = $1", [id])
      const params = {
        Bucket: bucketName,
        Key: s3_key
      }
      const command = new DeleteObjectCommand(params)
      await s3.send(command)
      res.status(200).send("success")

    } else {
      res.status(404).send("Audio not found!")
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "Internal server error"})
  }
})



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
