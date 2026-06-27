# AuroraLearn — Developer Dashboard

A sleek, full-stack learning dashboard built with **Node.js + Express** on the backend and **Vanilla JS** on the frontend. It lets developers track course progress, view stats, and manage their learning journey — all in real time.

---

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Backend  | Node.js, Express v5      |
| Frontend | HTML5, CSS3, Vanilla JS  |
| API      | RESTful (JSON)           |

---

## Project Structure

```
auroralearn/
├── server.js       # Express server & API routes
├── app.js          # Frontend logic & API calls
├── index.html      # Main UI
├── style.css       # Styling
└── package.json    # Dependencies
```

---

## Getting Started

**Prerequisites:** Node.js v18+

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open `index.html` in your browser. The backend runs at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/courses`                  | Fetch all courses        |
| GET    | `/api/courses/:id`              | Fetch single course      |
| PUT    | `/api/courses/:id/progress`     | Update course progress   |
| GET    | `/api/stats`                    | Fetch user stats         |

---

## Features

- Live course progress tracking with real-time updates
- Filter courses by status, category, and difficulty
- Searchable course list with instant dropdown results
- Modal detail view fetched directly from the API
- User stats panel (hours learned, streak, skill score)
- Toast notifications for user actions

---

## Author

**Abdul Wahab** — Built with passion & ethereal blue.# DecodeLabs_Project-04_Abdul-Wahab
