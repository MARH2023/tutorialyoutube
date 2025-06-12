document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const pendingCount = document.getElementById('pendingCount');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Función para guardar las tareas en el localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Función para actualizar el contador de tareas pendientes
    const updatePendingCount = () => {
        const pending = tasks.filter(task => !task.completed).length;
        pendingCount.textContent = pending;
    };

    // Función para crear un elemento de tarea
    const createTaskElement = (task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            tasks[index].completed = checkbox.checked;
            li.classList.toggle('completed');
            saveTasks();
            updatePendingCount();
        });

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            li.remove();
            saveTasks();
            updatePendingCount();
        });

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        return li;
    };

    // Función para mostrar las tareas según el filtro
    const showTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });
        
        filteredTasks.forEach((task, index) => {
            const li = createTaskElement(task, tasks.indexOf(task));
            taskList.appendChild(li);
        });
    };

    // Evento para añadir nueva tarea
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            showTasks();
            taskInput.value = '';
            updatePendingCount();
        }
    });

    // Evento para filtrar tareas
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showTasks(btn.dataset.filter);
        });
    });

    // Evento para borrar tareas completadas
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        showTasks();
        updatePendingCount();
    });

    // Inicializar la aplicación
    showTasks();
    updatePendingCount();
});
