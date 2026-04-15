/*GLOBAL STATE & SELECTORS*/
let tasks = [];
const modal = document.getElementById('task-modal');
const taskCountBadge = document.getElementById('task-count');

/*1. CREATE TASK CARD*/
function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.classList.add('note-item');
    li.setAttribute('data-id', taskObj.id);

    // Title Section
    const titleContainer = document.createElement('div');
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "space-between";
    titleContainer.style.alignItems = "center";

    const title = document.createElement('strong');
    title.classList.add('task-title-text');
    title.textContent = taskObj.title;
    title.setAttribute('data-action', 'edit-title');

    const badge = document.createElement('span');
    badge.classList.add('badge');
    badge.textContent = taskObj.priority;

    titleContainer.appendChild(title);
    titleContainer.appendChild(badge);

    // Description
    const desc = document.createElement('p');
    desc.classList.add('task-desc-text');
    desc.style.fontSize = "0.85rem";
    desc.style.margin = "0.5rem 0";
    desc.textContent = taskObj.description;

    // Date
    const date = document.createElement('div');
    date.classList.add('task-date-text');
    date.style.fontSize = "0.75rem";
    date.style.color = "#64748b";
    date.textContent = "Due: " + taskObj.dueDate;

    // Action Buttons
    const btnGroup = document.createElement('div');
    btnGroup.style.marginTop = "1rem";
    btnGroup.style.display = "flex";
    btnGroup.style.gap = "0.5rem";

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.style.padding = "0.3rem 0.8rem";
    editBtn.style.fontSize = "0.7rem";
    editBtn.setAttribute('data-action', 'edit-modal');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.style.padding = "0.3rem 0.8rem";
    deleteBtn.style.fontSize = "0.7rem";
    deleteBtn.style.background = "#ef4444";
    deleteBtn.setAttribute('data-action', 'delete');

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(titleContainer);
    li.appendChild(desc);
    li.appendChild(date);
    li.appendChild(btnGroup);

    return li;
}

/*2. CORE CRUD FUNCTIONS*/
function addTask(listId, taskObj) {
    const list = document.getElementById(listId);
    const card = createTaskCard(taskObj);
    list.appendChild(card);

    tasks.push(taskObj);
    updateCounter();
}

function deleteTask(taskId) {
    const card = document.querySelector("li[data-id='" + taskId + "']");
    if (!card) return;

    card.classList.add('fade-out');
    card.addEventListener('animationend', function() {
        card.remove();
        tasks = tasks.filter(t => t.id !== taskId);
        updateCounter();
    }, { once: true });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('due-date').value = task.dueDate;

    modal.setAttribute('data-editing-id', taskId);
    modal.removeAttribute('hidden');
}

function updateTask(taskId, updatedData) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;

    tasks[index] = Object.assign(tasks[index], updatedData);

    const card = document.querySelector("li[data-id='" + taskId + "']");
    if (card) {
        card.querySelector('.task-title-text').textContent = updatedData.title;
        card.querySelector('.task-desc-text').textContent = updatedData.description;
        card.querySelector('.badge').textContent = updatedData.priority;
        card.querySelector('.task-date-text').textContent = "Due: " + updatedData.dueDate;
    }
}

function updateCounter() {
    taskCountBadge.textContent = tasks.length;
}

/*3. EVENT HANDLING & DELEGATION*/
const listIds = ['todo-list', 'inprogress-list', 'done-list'];
listIds.forEach(function(id) {
    const list = document.getElementById(id);

    list.addEventListener('click', function(e) {
        const action = e.target.getAttribute('data-action');
        const card = e.target.closest('li');
        if (!card) return;
        const taskId = card.getAttribute('data-id');

        if (action === 'delete') deleteTask(taskId);
        if (action === 'edit-modal') editTask(taskId);
    });

    list.addEventListener('dblclick', function(e) {
        if (e.target.getAttribute('data-action') === 'edit-title') {
            const titleEl = e.target;
            const originalVal = titleEl.textContent;
            const taskId = titleEl.closest('li').getAttribute('data-id');

            const input = document.createElement('input');
            input.value = originalVal;
            input.style.width = "100%";

            titleEl.replaceWith(input);
            input.focus();

            const saveInline = function() {
                const newVal = input.value.trim() || originalVal;
                updateTask(taskId, { title: newVal });
                titleEl.textContent = newVal;
                input.replaceWith(titleEl);
            };

            input.addEventListener('blur', saveInline);
            input.addEventListener('keydown', function(k) {
                if (k.key === 'Enter') saveInline();
            });
        }
    });
});

// Priority Filter
document.getElementById('priority-filter').addEventListener('change', function(e) {
    const selected = e.target.value;
    const cards = document.querySelectorAll('.note-item');

    cards.forEach(function(card) {
        const taskId = card.getAttribute('data-id');
        const task = tasks.find(t => t.id === taskId);
        const isMatch = (
            selected === 'all' || 
            (task && task.priority.toLowerCase() === selected.toLowerCase())
        );
        card.classList.toggle('is-hidden', !isMatch);
    });
});

// Clear Done
document.getElementById('clear-done-btn').addEventListener('click', function() {
    const doneList = document.getElementById('done-list');
    const cards = Array.from(doneList.querySelectorAll('li'));

    cards.forEach(function(card, index) {
        setTimeout(function() {
            deleteTask(card.getAttribute('data-id'));
        }, index * 100);
    });
});

document.querySelectorAll('.add-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        modal.removeAttribute('data-editing-id');
        document.getElementById('task-title').value = "";
        document.getElementById('task-desc').value = "";
        modal.removeAttribute('hidden');

        modal.setAttribute('data-target-column', btn.parentElement.id);
    });
});

document.getElementById('cancel-btn').addEventListener('click', function() {
    modal.setAttribute('hidden', 'true');
});

document.getElementById('save-btn').addEventListener('click', function() {
    const editingId = modal.getAttribute('data-editing-id');
    const targetCol = modal.getAttribute('data-target-column');

    const data = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        priority: document.getElementById('task-priority').value,
        dueDate: document.getElementById('due-date').value
    };

    if (editingId) {
        updateTask(editingId, data);
    } else {
        const newTask = Object.assign({ id: Date.now().toString() }, data);

        let listId = "";
        if (targetCol === "todo") listId = "todo-list";
        else if (targetCol === "inprogress") listId = "inprogress-list";
        else if (targetCol === "done") listId = "done-list";

        addTask(listId, newTask);
    }

    modal.setAttribute('hidden', 'true');
});
