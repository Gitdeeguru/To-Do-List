const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const showAllBtn = document.getElementById('showAllBtn');
const showCompletedBtn = document.getElementById('showCompletedBtn');
const showPendingBtn = document.getElementById('showPendingBtn');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    taskInput.value = '';
  }
});


showAllBtn.addEventListener('click', () => {
  filterTasks('all');
});

showCompletedBtn.addEventListener('click', () => {
  filterTasks('completed');
});

showPendingBtn.addEventListener('click', () => {
  filterTasks('pending');
});

toggleDarkModeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    document.querySelector('.todo-container').classList.remove('dark-mode');
    
    toggleDarkModeBtn.textContent = "Dark Mode";  
  } else {
    document.body.classList.add('dark-mode');
    document.querySelector('.todo-container').classList.add('dark-mode');
  
    toggleDarkModeBtn.textContent = "Light Mode"; 
  }
});

function addTask(taskText) {
  const li = document.createElement('li');
  li.textContent = taskText;
  li.setAttribute('draggable', 'true');

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateLocalStorage();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
  });

  li.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', null);
    li.style.opacity = '0.5';
  });

  li.addEventListener('dragend', () => {
    li.style.opacity = '1';
    updateLocalStorage();
  });

  li.appendChild(deleteBtn);  
  taskList.appendChild(li);
  updateLocalStorage();
}

function updateLocalStorage() {
  const tasks = [];
  const taskItems = document.querySelectorAll('li');

  taskItems.forEach(item => {
    tasks.push({
      text: item.textContent.replace('Delete', '').trim(),
      completed: item.classList.contains('completed')
    });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  console.log("Loading tasks:", tasks); 

  tasks.forEach(task => {
    console.log("Task loaded:", task.text); 

    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    li.setAttribute('draggable', 'true');

    li.addEventListener('click', () => {
      li.classList.toggle('completed');
      updateLocalStorage();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      updateLocalStorage();
    });

    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', null);
      li.style.opacity = '0.5';
      console.log("Drag started for:", task.text); 
    });

    li.addEventListener('dragend', () => {
      li.style.opacity = '1';
      updateLocalStorage();
      console.log("Drag ended for:", task.text); 
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  console.log("All tasks loaded successfully.");
}


function filterTasks(filter) {
  const tasks = document.querySelectorAll('li');

  tasks.forEach(task => {
    const isCompleted = task.classList.contains('completed');
    if (filter === 'all') {
      task.style.display = 'flex';
    } else if (filter === 'completed' && isCompleted) {
      task.style.display = 'flex';
    } else if (filter === 'pending' && !isCompleted) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
}
