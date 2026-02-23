const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  // Create Trainers table
  db.run(`CREATE TABLE IF NOT EXISTS trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    experience TEXT NOT NULL,
    specialty TEXT,
    bio TEXT,
    image_url TEXT
  )`);

  // Create Members/Inquiries table
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create Memberships table
  db.run(`CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    price REAL NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Insert Surabhi Hegade with Image
  const stmt = db.prepare("INSERT INTO trainers (name, experience, specialty, bio, image_url) VALUES (?, ?, ?, ?, ?)");
  stmt.run(
    "Surabhi Hegade",
    "2 Years",
    "Fitness & Yoga",
    "Expert trainer with 2 years of experience in helping clients achieve their dream physique through dedicated guidance.",
    "https://images.unsplash.com/photo-1548690312-e3b507d17a12?auto=format&fit=crop&q=80&w=800"
  );
  stmt.finalize();

  console.log("Database initialized with trainers, users, and memberships tables.");
});

db.close();
