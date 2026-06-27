# ✦ AuroraLearn — Developer Learning Dashboard

> **Empowering developers to learn smarter, track deeper, and grow faster.**

AuroraLearn is a modern, full-stack developer learning dashboard that brings together course management, real-time progress tracking, and personalized statistics — all wrapped in a clean, responsive interface. Built with a lightweight yet powerful tech stack, it demonstrates how a RESTful Express backend can seamlessly power a dynamic Vanilla JS frontend without the overhead of a heavy framework.

---

## 🚀 Overview

Whether you're tracking multiple courses, filtering by difficulty, or checking your daily learning streak, AuroraLearn gives you a birds-eye view of your entire learning journey. The dashboard fetches live data from a local Express API, ensuring that every progress update, stat, and course detail is always fresh and accurate.

---

## 🛠️ Tech Stack

| Layer       | Technology                        | Purpose                                      |
|-------------|-----------------------------------|----------------------------------------------|
| **Backend** | Node.js + Express v5              | REST API server, data management, CORS       |
| **Frontend**| HTML5, CSS3, Vanilla JavaScript   | UI rendering, DOM manipulation, API calls    |
| **API Style**| RESTful (JSON)                   | Clean, stateless communication between layers|
| **Fonts**   | Google Fonts (Inter, Space Grotesk) | Modern, readable typography               |

---

## 📁 Project Structure

```
auroralearn/
│
├── server.js         # Express server — API routes, CORS config, in-memory data
├── app.js            # Frontend engine — API calls, state management, UI rendering
├── index.html        # Main dashboard layout — navbar, sidebar, hero, cards, modal
├── style.css         # Complete styling — dark theme, animations, responsive layout
└── package.json      # Project metadata and dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation & Setup

```bash
# 1. Clone or download the project
git clone https://github.com/your-username/auroralearn.git
cd auroralearn

# 2. Install backend dependencies
npm install

# 3. Start the Express server
npm start
```

> The server will start at **`http://localhost:3000`**

### Running the Frontend

Once the server is running, simply open `index.html` in your browser. The frontend will automatically connect to the backend and load all courses and stats.

```
✅ Server running at: http://localhost:3000
✅ Open index.html in your browser
✅ Dashboard loads live data from the API
```

---

## 📡 API Reference

All endpoints are served from `http://localhost:3000` and return JSON responses.

### Courses

| Method   | Endpoint                        | Description                                      |
|----------|---------------------------------|--------------------------------------------------|
| `GET`    | `/api/courses`                  | Retrieve the full list of enrolled courses       |
| `GET`    | `/api/courses/:id`              | Retrieve detailed info for a single course       |
| `PUT`    | `/api/courses/:id/progress`     | Update the progress percentage of a course       |

### Stats

| Method   | Endpoint       | Description                                              |
|----------|----------------|----------------------------------------------------------|
| `GET`    | `/api/stats`   | Retrieve user statistics (hours, streak, skill score)    |

### Example Response — `GET /api/courses`

```json
[
  {
    "id": 1,
    "title": "Advanced React Design",
    "category": "frontend",
    "progress": 48,
    "difficulty": "advanced",
    "instructor": "Sarah Chen",
    "lessons": 42,
    "duration": "18h 30m",
    "completed": false
  }
]
```

### Example Request — `PUT /api/courses/:id/progress`

```json
{
  "progress": 75
}
```

---

## ✨ Features

### 📊 Live Stats Panel
Displays real-time user metrics pulled from the `/api/stats` endpoint — including total hours learned, certificates earned, current learning streak, and overall skill score.

### 📚 Course Grid with Smart Filtering
Browse enrolled courses and filter them instantly by:
- **Status** — All, In Progress, Completed, Daily Goal
- **Category** — Frontend, Backend, Data Science, DevOps
- **Difficulty** — Beginner, Intermediate, Advanced

### 🔍 Instant Search with Dropdown
A live search bar in the navbar lets users search courses by title, category, or instructor name — with a real-time dropdown showing the top 5 matching results.

### 🪟 Course Detail Modal
Clicking any course card opens a detailed modal that fetches fresh data directly from the backend, showing lesson count, remaining lessons, duration, instructor, and difficulty level.

### 🔄 Real-Time Progress Updates
Course progress is dynamically reflected in animated progress bars. Completed courses display a certificate badge; in-progress courses show a resume button.

### 🔔 Toast Notification System
Non-intrusive toast messages provide instant feedback for every user action — resuming a course, viewing a certificate, navigating pages, and more.

### 📱 Responsive & Accessible
The layout adapts gracefully across screen sizes. All interactive elements include keyboard navigation support and ARIA labels for accessibility.

---

## 🎨 Design Highlights

- **Dark theme** with rich gradient card thumbnails per category
- **Glassmorphism-style** sidebar and stat cards
- **Smooth CSS animations** for cards, modals, and toasts
- **Color-coded categories** for instant visual recognition

---

## 🔧 Error Handling

The frontend handles network errors gracefully. If the backend is unreachable, a friendly error message is shown with a **Retry** button — so the user is never left with a broken or empty screen.

---

## 📌 Future Improvements

- [ ] Persistent data storage with a database (e.g., MongoDB or PostgreSQL)
- [ ] User authentication and session management
- [ ] Course enrollment and unenrollment functionality
- [ ] Analytics page with learning trends and charts
- [ ] Mobile-first responsive redesign

---

## 👤 Author

**Abdul Wahab**  
Full-Stack Developer · Built with passion & ethereal blue.

---

© 2026 AuroraLearn. Empowering developers worldwide.
