const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const prioritySelect = document.getElementById("prioritySelect");
const tagsInput = document.getElementById("tagsInput");
const toggleDarkMode = document.getElementById("toggleDarkMode");

// Add new task
addBtn.addEventListener("click", () => {
  const taskText = inputBox.value.trim();
  const priority = prioritySelect.value;
  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(t => t !== "");

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const li = document.createElement("li");
  li.classList.add(priority);

  const content = document.createElement("div");
  content.className = "task-content";

  const taskPara = document.createElement("p");
  taskPara.textContent = taskText;

  const tagContainer = document.createElement("div");
  tagContainer.className = "tags";
  tagContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join(" ");

  content.appendChild(taskPara);
  content.appendChild(tagContainer);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";

   
  deleteBtn.onclick = () => li.remove();
    updateProgressBar();
  li.appendChild(content);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);

  inputBox.value = "";
  tagsInput.value = "";
 updateProgressBar();
});

// Toggle dark mode
toggleDarkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
const completedList = document.getElementById("completedList");
const completedCount = document.getElementById("completedCount");
let completedTasks = 0;

function updateCompletedCount(change) {
  completedTasks += change;
  completedCount.textContent = `(${completedTasks})`;
}

// Attach event after adding a new task
addBtn.addEventListener("click", () => {
  const latestTask = todoList.lastElementChild;
  if (!latestTask) return;

  const content = latestTask.querySelector(".task-content");
  const taskPara = content.querySelector("p");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";

  // Track task creation date
  const createdDate = new Date();
  const dateLabel = document.createElement("small");
  dateLabel.className = "pending-duration";

  // Function to calculate and display pending days
  function updatePendingDuration() {
    const now = new Date();
    const diff = now - createdDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    dateLabel.textContent = `Pending for ${days} day(s)`;
  }

  updatePendingDuration();
  const pendingTimer = setInterval(updatePendingDuration, 60000); // Update every minute

  content.prepend(checkbox);
  content.appendChild(dateLabel);

  checkbox.onchange = () => {
    if (checkbox.checked) {
      taskPara.classList.add("completed");
      latestTask.remove();
      clearInterval(pendingTimer); // stop timer once completed
      dateLabel.remove();
      completedList.appendChild(latestTask);
      updateCompletedCount(1);
    } else {
      taskPara.classList.remove("completed");
      completedList.removeChild(latestTask);
      content.appendChild(dateLabel);
      todoList.appendChild(latestTask);
      updateCompletedCount(-1);
    }
      updateProgressBar();
  };
});


let hasRemindedToday = false;

function remindIfPendingTasksAtEndOfDay() {
  const reminderHour = 20; // 8 PM
  const now = new Date();

  if (now.getHours() === reminderHour && now.getMinutes() === 0 && !hasRemindedToday) {
    const pendingTasks = document.querySelectorAll("#todoList li").length;

    if (pendingTasks > 0) {
      // Play reminder sound
      const sound = document.getElementById("reminderSound");
      if (sound) sound.play();

      // Blink screen effect
      document.body.classList.add("blink-bg");
      setTimeout(() => {
        document.body.classList.remove("blink-bg");
      }, 3000); // blink for 3 seconds

      hasRemindedToday = true;
    }
  }

  // Reset reminder flag at midnight
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    hasRemindedToday = false;
  }
}

// Call it every minute
setInterval(remindIfPendingTasksAtEndOfDay, 60000);
const testBtn = document.getElementById("testReminderBtn");
testBtn.addEventListener("click", () => {
  const sound = document.getElementById("reminderSound");
  if (sound) {
    sound.play();
    document.body.classList.add("blink-bg");
    setTimeout(() => {
      document.body.classList.remove("blink-bg");
    }, 3000);
  }
});
function updateProgressBar() {
  const allTasks = document.querySelectorAll("#todoList li, #completedList li");
  const completedTasks = document.querySelectorAll("#completedList li");

  const total = allTasks.length;
  const completed = completedTasks.length;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("progressCompleted").style.width = `${percent}%`;
  document.getElementById("percentCompleted").textContent = `Completed: ${percent}%`;
  document.getElementById("percentPending").textContent = `Pending: ${100 - percent}%`;
}

