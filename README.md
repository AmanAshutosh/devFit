# devFit 💪

A modern, minimalist full-stack fitness tracking platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, xlsx |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Email OTP (Nodemailer / Gmail SMTP) |
| Styling | Pure CSS with CSS Variables |

---

## Project Structure

```
devfit/
├── backend/
│   ├── config/
│   │   └── email.js              # Nodemailer SMTP config + OTP generator
│   ├── controllers/
│   │   ├── authController.js     # Register, verify OTP, login
│   │   ├── userController.js     # Get/update profile, BMI calc
│   │   ├── exerciseController.js # CRUD + export
│   │   ├── dietController.js     # Daily diet log with macros
│   │   ├── supplementController.js
│   │   ├── gymPlanController.js  # Custom + predefined plans
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js               # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Exercise.js
│   │   ├── Diet.js
│   │   ├── Supplement.js
│   │   └── GymPlan.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── exercise.js
│   │   ├── diet.js
│   │   ├── supplements.js
│   │   ├── gymPlan.js
│   │   └── analytics.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── hooks/
        │   └── useNotifications.js
        ├── utils/
        │   ├── api.js            # Axios instance + interceptors
        │   ├── helpers.js        # BMI calc, date formatters
        │   └── exportExcel.js    # xlsx export
        ├── components/
        │   ├── Sidebar/          # Navigation sidebar
        │   ├── Footer/           # "Made by Ashutosh"
        │   └── PrivateRoute/     # Auth guard
        ├── pages/
        │   ├── Auth/             # Login + Register + OTP
        │   ├── Dashboard/        # Home overview
        │   ├── Profile/          # Personal info + BMI + export
        │   ├── GymPlan/          # Weekly plan builder
        │   ├── ExerciseTracker/  # Log workouts
        │   ├── DietTracker/      # Log meals + macros
        │   ├── SupplementTracker/
        │   ├── Analytics/        # Charts & graphs
        │   └── VideoSuggestions/ # YouTube video library
        ├── App.jsx
        ├── index.js
        └── index.css             # Global styles + CSS variables
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd devfit
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devfit
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password    # Generate at myaccount.google.com/apppasswords
CLIENT_URL=http://localhost:3000
```

> **Gmail App Password:** Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords). Generate a password for "Mail" on "Other device" → name it "devFit".

```bash
npm run dev    # Development with nodemon
# OR
npm start      # Production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`. The frontend proxies API calls to `http://localhost:5000`.

---

## API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register with name, email, mobile, password |
| POST | `/verify-otp` | Verify 6-digit OTP from email |
| POST | `/login` | Login and get JWT token |

### User Routes (`/api/user`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get full profile + BMI |
| PUT | `/profile` | Update profile/measurements |

### Exercise Routes (`/api/exercise`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get exercises (filter by ?date=) |
| POST | `/` | Log new exercise |
| PUT | `/:id` | Edit exercise |
| DELETE | `/:id` | Delete exercise |
| GET | `/export` | Get all exercises for Excel export |

### Diet Routes (`/api/diet`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get diet log for ?date= |
| POST | `/entry` | Add food entry |
| DELETE | `/entry/:entryId` | Remove food entry |
| GET | `/history` | Last 30-day summary |

### Supplement Routes (`/api/supplements`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get supplements for ?date= |
| POST | `/` | Log supplement |
| DELETE | `/:id` | Delete supplement |

### Gym Plan Routes (`/api/gymplan`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's plan + predefined plans |
| POST | `/` | Save custom plan |
| POST | `/load-predefined` | Load a preset plan |

### Analytics Routes (`/api/analytics`) — 🔒 Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview?days=30` | Workout + diet analytics |

---

## Features Checklist

- [x] Email OTP registration via Gmail SMTP
- [x] JWT authentication with auto-logout on expiry
- [x] BMI auto-calculation (weight + height → instant result)
- [x] Exercise logging with volume tracking
- [x] Excel export of all exercise data
- [x] Diet tracker with macros (protein, carbs, fats, calories)
- [x] Supplement tracker with timing
- [x] Weekly gym plan builder (6 days)
- [x] 3 predefined plans (Beginner / Intermediate / Advanced)
- [x] Analytics dashboard with Recharts
- [x] Daily streak system
- [x] Browser push notifications for gym time
- [x] YouTube video library
- [x] Fully responsive (desktop + mobile)
- [x] Minimalist white design with CSS variables
- [x] MVC architecture (models / controllers / routes)
- [x] Password hashing with bcrypt (salt rounds: 12)
- [x] Rate limiting on all API routes
- [x] Separate JSX + CSS per component/page

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g., `7d`) |
| `EMAIL_USER` | Gmail address for OTP |
| `EMAIL_PASS` | Gmail App Password |
| `CLIENT_URL` | Frontend URL for CORS |

---

## Made by Ashutosh 💚

Built with React · Node.js · MongoDB · Express · devFit
