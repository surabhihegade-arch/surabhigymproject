const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3001;
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to hash passwords
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// API to get trainers
app.get('/api/trainers', (req, res) => {
    db.all("SELECT * FROM trainers", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API to submit inquiries
app.post('/api/inquiries', (req, res) => {
    const { name, email, phone, message, program } = req.body;
    const sql = 'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, email, phone, message || program], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: "Success" });
    });
});

// Admin API to see inquiries
app.get('/api/admin/inquiries', (req, res) => {
    db.all("SELECT * FROM inquiries ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Register new user
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    const hashedPassword = hashPassword(password);
    const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    
    db.run(sql, [name, email, hashedPassword, phone], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            return res.status(500).json({ error: err.message });
        }
        
        // Create session (simple token-based)
        const token = crypto.randomBytes(32).toString('hex');
        const userId = this.lastID;
        
        res.json({ 
            success: true, 
            token, 
            user: { id: userId, name, email } 
        });
    });
});

// Login user
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const hashedPassword = hashPassword(password);
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    db.get(sql, [email, hashedPassword], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Create session token
        const token = crypto.randomBytes(32).toString('hex');
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name, email: user.email } 
        });
    });
});

// Get current user profile
app.get('/api/auth/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    // In production, store tokens in DB. For demo, we'll just validate format.
    // This is a simplified auth system.
    
    res.json({ success: true, authenticated: true });
});

// Get user membership
app.get('/api/membership', (req, res) => {
    const userId = req.query.userId;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
    }
    
    db.get("SELECT * FROM memberships WHERE user_id = ? ORDER BY start_date DESC", [userId], (err, membership) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(membership || null);
    });
});

// Purchase/activate membership
app.post('/api/membership', (req, res) => {
    const { userId, planName, planType, price } = req.body;
    
    if (!userId || !planName || !planType || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Calculate end date based on plan type (monthly)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month membership
    
    const sql = 'INSERT INTO memberships (user_id, plan_name, plan_type, price, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.run(sql, [userId, planName, planType, price, startDate.toISOString(), endDate.toISOString()], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ 
            success: true, 
            membershipId: this.lastID,
            message: 'Membership activated successfully!'
        });
    });
});

// Get all memberships (admin)
app.get('/api/admin/memberships', (req, res) => {
    const sql = `
        SELECT m.*, u.name, u.email, u.phone 
        FROM memberships m 
        JOIN users u ON m.user_id = u.id 
        ORDER BY m.start_date DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get all users (admin)
app.get('/api/admin/users', (req, res) => {
    db.all("SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Gym Project Server running at http://localhost:${port}`);
});
