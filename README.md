# 💪 Surabhi Gym Project

A modern, full-featured gym management website with user authentication and membership system.

![Gym Project](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200)

## 🚀 Features

### For Users
- **User Authentication** - Sign up and sign in with secure password hashing
- **Membership Plans** - Choose from Basic ($25), Premium ($30), or Pro ($45) plans
- **User Dashboard** - View active membership, plan details, and validity
- **Program Enrollment** - Join fitness programs (Strength Training, Cardio, Fat Burn, Health Fitness)
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### For Admins
- **Inquiries Management** - View all membership inquiries
- **Memberships Overview** - Track all active memberships
- **User Management** - View all registered users

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Authentication:** SHA-256 password hashing with token-based sessions

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/surabhihegade-arch/surabhigymproject.git
   cd surabhigymproject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   node init_db.js
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open in browser**
   - Main Website: http://localhost:3001
   - Admin Panel: http://localhost:3001/admin.html

## 📁 Project Structure

```
surabhigymproject/
├── public/
│   ├── index.html      # Main website
│   ├── admin.html      # Admin dashboard
│   ├── main.js         # Frontend JavaScript
│   └── style.css       # Styles
├── server.js           # Backend API server
├── init_db.js          # Database initialization
├── package.json        # Dependencies
└── README.md           # This file
```

## 🔐 User Features

### Sign Up / Sign In
- Click "Sign Up" to create a new account
- Enter name, email, phone, and password
- After registration, you're automatically logged in

### Purchase Membership
1. Sign in to your account
2. Click "Dashboard" in the navigation
3. Select a membership plan (Basic, Premium, or Pro)
4. Confirm purchase to activate membership
5. Membership is valid for 1 month

### View Membership
- Open Dashboard to see:
  - Current plan name
  - Price paid
  - Start date
  - Valid until date
  - Membership status

## 🎨 Features Overview

| Feature | Description |
|---------|-------------|
| Authentication | Secure sign up/sign in with hashed passwords |
| Membership System | 3-tier plan system with automatic activation |
| User Dashboard | Personal dashboard for membership management |
| Admin Panel | Complete admin dashboard for managing users & memberships |
| Responsive Design | Mobile-first responsive design |
| Smooth Animations | Counter animations, modal transitions, hover effects |
| Testimonials | Auto-rotating testimonials carousel |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Membership
- `GET /api/membership?userId=` - Get user membership
- `POST /api/membership` - Purchase membership

### Admin
- `GET /api/admin/inquiries` - Get all inquiries
- `GET /api/admin/memberships` - Get all memberships
- `GET /api/admin/users` - Get all users

### Other
- `GET /api/trainers` - Get all trainers
- `POST /api/inquiries` - Submit inquiry

## 📸 Screenshots

### Homepage
Modern, responsive homepage with hero section, programs, plans, and testimonials.

### User Dashboard
Personal dashboard showing membership status and quick actions.

### Admin Panel
Complete admin dashboard with tabs for inquiries, memberships, and users.

## 👨‍💻 Author

**Surabhi Hegade**

GitHub: [@surabhihegade-arch](https://github.com/surabhihegade-arch)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Happy Fitness! 🏋️‍♂️💪**
