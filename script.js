/* ============================================================
   TaskFlow — To-Do List Web App
   CodeOrbit Tech Internship — Task 2
   Vanilla JavaScript + localStorage
   ============================================================ */

(function () {
  "use strict";

  /* ---------- CONSTANTS ---------- */
  var STORAGE_KEY = "taskflow_tasks";
  var THEME_KEY = "taskflow_theme";

  /* ---------- STATE ---------- */
  var tasks = [];
  var currentFilter = "all";

  /* ---------- DOM REFERENCES ---------- */
  var taskForm = document.getElementById("addTaskForm");
  var taskInput = document.getElementById("taskInput");
  var inputFeedback = document.getElementById("inputFeedback");
  var taskList = document.getElementById("taskList");
  var emptyState = document.getElementById("emptyState");
  var emptyMessage = document.getElementById("emptyMessage");
  var totalCountEl = document.getElementById("totalCount");
  var activeCountEl = document.getElementById("activeCount");
  var completedCountEl = document.getElementById("completedCount");
  var clearCompletedBtn = document.getElementById("clearCompleted");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var themeToggle = document.getElementById("themeToggle");

  /* ---------- ICON SVG STRINGS ---------- */
  var ICON_CHECK =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var ICON_EDIT =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  var ICON_DELETE =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';

  /* ============================================================
     STORAGE: TASKS
     ============================================================ */

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        tasks = [];
        return;
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        tasks = [];
        return;
      }
      // Validate each task object so corrupted data won't crash the app
      tasks = parsed.filter(function (t) {
        return (
          t &&
          typeof t.id !== "undefined" &&
          typeof t.text === "string" &&
          typeof t.completed === "boolean"
        );
      });
    } catch (e) {
      // Corrupted or invalid JSON — start fresh
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      // localStorage might be unavailable (private mode, quota, etc.)
      // Fail silently — app still works in-memory for the session
    }
  }

  /* ============================================================
     STORAGE: THEME
     ============================================================ */

  function loadTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch (e) {
      // Default theme (dark) stays if localStorage is unavailable
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Ignore — theme just won't persist
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    saveTheme(next);
  }

  /* ============================================================
     TASK CRUD
     ============================================================ */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function addTask(text) {
    var trimmed = text.trim();
    if (!trimmed) return false;

    var task = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    return true;
  }

  function toggleTask(id) {
    var task = findTask(id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks();
    renderTasks();
  }

  function saveEdit(id, newText) {
    var trimmed = newText.trim();
    if (!trimmed) return false;

    var task = findTask(id);
    if (!task) return false;

    task.text = trimmed;
    saveTasks();
    renderTasks();
    return true;
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) {
      return !t.completed;
    });
    saveTasks();
    renderTasks();
  }

  function findTask(id) {
    return tasks.find(function (t) {
      return t.id === id;
    });
  }

  /* ============================================================
     FILTERING
     ============================================================ */

  function getFilteredTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (t) {
        return !t.completed;
      });
    }
    if (currentFilter === "completed") {
      return tasks.filter(function (t) {
        return t.completed;
      });
    }
    return tasks;
  }

  function setFilter(filter) {
    currentFilter = filter;

    // Update active state on filter buttons
    filterButtons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-filter") === filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    renderTasks();
  }

  /* ============================================================
     RENDERING
     ============================================================ */

  function renderTasks() {
    var filtered = getFilteredTasks();

    // Clear current list
    taskList.innerHTML = "";

    // Show/hide empty state
    if (filtered.length === 0) {
      taskList.hidden = true;
      emptyState.hidden = false;
      updateEmptyMessage();
    } else {
      taskList.hidden = false;
      emptyState.hidden = true;

      filtered.forEach(function (task) {
        taskList.appendChild(createTaskElement(task));
      });
    }

    updateCounters();
    updateClearButton();
  }

  function updateEmptyMessage() {
    if (tasks.length === 0) {
      emptyMessage.textContent = "No tasks yet. Add your first task above.";
    } else if (currentFilter === "active") {
      emptyMessage.textContent = "No active tasks.";
    } else if (currentFilter === "completed") {
      emptyMessage.textContent = "No completed tasks yet.";
    }
  }

  function createTaskElement(task) {
    var li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.setAttribute("data-id", task.id);

    /* --- Checkbox --- */
    var checkboxWrap = document.createElement("label");
    checkboxWrap.className = "task-checkbox";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as complete");

    var checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.innerHTML = ICON_CHECK;

    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    checkboxWrap.appendChild(checkbox);
    checkboxWrap.appendChild(checkmark);

    /* --- Task text --- */
    var textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    /* --- Action buttons --- */
    var actions = document.createElement("div");
    actions.className = "task-actions";

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "task-action-btn edit-btn";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.title = "Edit";
    editBtn.innerHTML = ICON_EDIT;
    editBtn.addEventListener("click", function () {
      enterEditMode(li, task);
    });

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task-action-btn delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.title = "Delete";
    deleteBtn.innerHTML = ICON_DELETE;
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkboxWrap);
    li.appendChild(textSpan);
    li.appendChild(actions);

    return li;
  }

  /* ============================================================
     INLINE EDIT MODE
     ============================================================ */

  function enterEditMode(li, task) {
    li.classList.add("editing");
    li.innerHTML = "";

    var editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.text;
    editInput.setAttribute("aria-label", "Edit task text");
    editInput.maxLength = 300;

    var editActions = document.createElement("div");
    editActions.className = "edit-actions";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-save";
    saveBtn.textContent = "Save";

    var cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-cancel";
    cancelBtn.textContent = "Cancel";

    // Save handler — rejects empty/whitespace text
    function doSave() {
      if (saveEdit(task.id, editInput.value)) {
        // renderTasks() already called inside saveEdit
      } else {
        editInput.classList.add("input-error");
        editInput.focus();
        editInput.select();
      }
    }

    saveBtn.addEventListener("click", doSave);

    // Cancel — re-render to discard changes
    cancelBtn.addEventListener("click", function () {
      renderTasks();
    });

    // Enter to save, Escape to cancel
    editInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        doSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        renderTasks();
      }
    });

    editActions.appendChild(saveBtn);
    editActions.appendChild(cancelBtn);

    li.appendChild(editInput);
    li.appendChild(editActions);

    editInput.focus();
    editInput.select();
  }

  /* ============================================================
     COUNTERS
     ============================================================ */

  function updateCounters() {
    var total = tasks.length;
    var completed = tasks.filter(function (t) {
      return t.completed;
    }).length;
    var active = total - completed;

    totalCountEl.textContent = total;
    activeCountEl.textContent = active;
    completedCountEl.textContent = completed;
  }

  function updateClearButton() {
    var hasCompleted = tasks.some(function (t) {
      return t.completed;
    });
    clearCompletedBtn.disabled = !hasCompleted;
  }

  /* ============================================================
     VALIDATION FEEDBACK
     ============================================================ */

  function showFeedback(message) {
    inputFeedback.textContent = message;
    inputFeedback.classList.add("visible");
    taskInput.classList.add("input-error");
  }

  function clearFeedback() {
    inputFeedback.textContent = "";
    inputFeedback.classList.remove("visible");
    taskInput.classList.remove("input-error");
  }

  /* ============================================================
     EVENT LISTENERS
     ============================================================ */

  // Add task form submit (covers both button click and Enter key)
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = taskInput.value;

    if (!value.trim()) {
      showFeedback("Please enter a task before adding.");
      taskInput.focus();
      return;
    }

    addTask(value);
    taskInput.value = "";
    clearFeedback();
    taskInput.focus();
  });

  // Clear feedback as soon as user types
  taskInput.addEventListener("input", function () {
    if (inputFeedback.classList.contains("visible")) {
      clearFeedback();
    }
  });

  // Filter buttons
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setFilter(btn.getAttribute("data-filter"));
    });
  });

  // Clear completed
  clearCompletedBtn.addEventListener("click", function () {
    clearCompleted();
  });

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    loadTheme();
    loadTasks();
    renderTasks();
  }

  init();
})();
