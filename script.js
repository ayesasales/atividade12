let tasks = [];
let filterStatus = 'all';

document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    const newTask = {
        name: taskName,
        dueDate: new Date(dueDate),
        completed: false,
        priority: priority
    };

    tasks.push(newTask);
    renderTasks();
    e.target.reset();
});

document.getElementById('filter-btn').addEventListener('click', function() {
    if (filterStatus === 'all') {
        filterStatus = 'completed';
    } else if (filterStatus === 'completed') {
        filterStatus = 'pending';
    } else {
        filterStatus = 'all';
    }
    renderTasks();
});

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'completed') return task.completed;
        if (filterStatus === 'pending') return !task.completed;
        return true; // all
    });

    filteredTasks.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.dueDate - b.dueDate;
        }
        return a.priority.localeCompare(b.priority);
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        if (isUrgent(task.dueDate)) {
            li.classList.add('urgent');
        }

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            ${task.name} - ${task.dueDate.toLocaleDateString()} - Prioridade: ${task.priority}
            <button onclick="editTask(${index})">Editar</button>
        `;
        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function isUrgent(dueDate) {
    const now = new Date();
    const timeDiff = dueDate - now;
    return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000; // menos de 24 horas
}

function editTask(index) {
    const task = tasks[index];
    const newName = prompt("Editar nome da tarefa:", task.name);
    const newDate = prompt("Editar data de conclusão (YYYY-MM-DD):", task.dueDate.toISOString().split('T')[0]);
    const newPriority = prompt("Editar prioridade (baixa, media, alta):", task.priority);

    if (newName) task.name = newName;
    if (newDate) task.dueDate = new Date(newDate);
    if (newPriority) task.priority = newPriority;

    renderTasks();
}
Explicaçã