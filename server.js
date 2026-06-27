const express = require('express');
const app = express();

app.use(express.json());

// CORS — frontend ko backend se baat karne deta hai
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const PORT = 3000;

// ── DATA ────────────────────────────────────────────────────

let tasks = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Build API",     completed: false },
];

const courses = [
  { id: 1, title: 'Advanced React Design',          category: 'frontend',     progress: 48,  difficulty: 'advanced',     instructor: 'Sarah Chen',   lessons: 42, duration: '18h 30m', completed: false },
  { id: 2, title: 'Distributed Systems with Go',    category: 'backend',      progress: 22,  difficulty: 'advanced',     instructor: 'James Park',   lessons: 56, duration: '24h 15m', completed: false },
  { id: 3, title: 'Data Visualization Masterclass', category: 'data-science', progress: 100, difficulty: 'intermediate', instructor: 'Maya Patel',   lessons: 38, duration: '14h 00m', completed: true  },
  { id: 4, title: 'UX Psychology Foundations',      category: 'design',       progress: 76,  difficulty: 'beginner',     instructor: 'Lena Müller',  lessons: 28, duration: '10h 45m', completed: false },
  { id: 5, title: 'Cybersecurity Fundamentals',     category: 'security',     progress: 5,   difficulty: 'intermediate', instructor: 'Marco Rossi',  lessons: 60, duration: '26h 00m', completed: false },
  { id: 6, title: 'Cloud Infrastructure (AWS)',     category: 'devops',       progress: 42,  difficulty: 'intermediate', instructor: 'Priya Sharma', lessons: 50, duration: '20h 30m', completed: false },
];

const userStats = {
  hoursLearned: 128.5,
  certificates: 4,
  currentStreak: 14,
  skillScore: 842,
  dailyMinutes: 45,
  name: 'Abdul Wahab',
};

// ── TASKS ROUTES ────────────────────────────────────────────

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task nahi mila' });
  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required hai' });
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ── COURSES ROUTES ──────────────────────────────────────────

app.get('/api/courses', (req, res) => {
  res.status(200).json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ error: 'Course nahi mila' });
  res.status(200).json(course);
});

app.put('/api/courses/:id/progress', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ error: 'Course nahi mila' });
  const { progress } = req.body;
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    return res.status(400).json({ error: 'Progress 0 se 100 ke beech hona chahiye' });
  }
  course.progress = progress;
  course.completed = progress === 100;
  res.status(200).json({ message: 'Progress update ho gaya!', course });
});

app.get('/api/stats', (req, res) => {
  res.status(200).json(userStats);
});

// ── SERVER START ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
  console.log('Test karo: http://localhost:3000/api/courses');
});