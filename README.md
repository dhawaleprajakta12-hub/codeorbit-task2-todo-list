# TaskFlow — To-Do List Web App

## Project Name

**TaskFlow** — a responsive, browser-based task management application.

> Simple tasks. Clear progress.

## Description

TaskFlow is a clean and modern to-do list web app built entirely with HTML, CSS, and Vanilla JavaScript. It lets users add, edit, delete, and organize tasks with filters and live counters — all persisted in the browser using `localStorage`. No frameworks, no backend, no database.

## Internship

**CodeOrbit Tech** — Full Stack Development Internship

## Task

**Task 2** — To-Do List Web App

## Features

- **Add tasks** — type a task and click "Add Task" or press Enter
- **Edit tasks** — inline editing with Save and Cancel controls
- **Delete tasks** — remove individual tasks instantly
- **Mark tasks completed** — checkbox toggles completion with visual styling
- **Mark tasks active again** — uncheck to restore a task to active state
- **All / Active / Completed filters** — switch views without modifying data
- **Total / Active / Completed counters** — live statistics that update automatically
- **Clear completed** — remove all completed tasks in one click
- **localStorage persistence** — tasks and theme survive page refresh
- **Dark / Light theme** — toggle with a Sun/Moon button; preference is saved
- **Responsive design** — works on desktop, tablet, and mobile
- **Basic validation** — empty and whitespace-only tasks are rejected with inline messages
- **Empty states** — friendly messages when no tasks match the current view
- **Accessibility** — semantic HTML, ARIA labels, keyboard support, focus states

## Technologies

```text
HTML5
CSS3
Vanilla JavaScript
Browser localStorage
```

## Project Structure

```text
TaskFlow/
├── index.html      # App structure and semantic markup
├── style.css      # Styling, themes, and responsive layout
├── script.js      # All app logic (CRUD, filters, persistence)
└── README.md       # This file
```

## How to Run

### Option 1 — Open Directly

1. Download or clone the project folder.
2. Double-click `index.html` to open it in any modern browser.
3. The app loads immediately — no installation required.

### Option 2 — Local Development Server (Optional)

If you prefer a dev server (useful for live reloading):

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve
```

Then open `http://localhost:8000` in your browser.

> **No Node.js, npm install, or backend is required.** The app runs entirely in the browser.

## Usage Guide

| Action | How |
|---|---|
| Add a task | Type in the input field and click **Add Task** or press **Enter** |
| Complete a task | Click the checkbox on the left of the task |
| Edit a task | Click the **Edit** (pencil) icon, modify text, then **Save** |
| Delete a task | Click the **Delete** (trash) icon |
| Filter tasks | Click **All**, **Active**, or **Completed** |
| Clear completed | Click the **Clear Completed** button |
| Toggle theme | Click the **Sun/Moon** icon in the header |

## Data Storage

All data is stored locally in the browser via `localStorage`:

- `taskflow_tasks` — the complete task array (JSON)
- `taskflow_theme` — the selected theme (`dark` or `light`)

No data is sent to any server. Clearing browser data will reset the app.

## Browser Compatibility

Works in all modern browsers: Chrome, Firefox, Edge, Safari, and Opera.

## License

© 2026 TaskFlow. All rights reserved.
