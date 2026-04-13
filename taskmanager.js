const task = [];

function createTaskCard(taskObj) {
	const li = document.createElement('li');
	li.setAttribute('id', taskObj.id);
	li.classList.add('task-card');

	//Title
	const title = document.createElement('h4');
	title.textContent = taskObj.title;
	li.appendChild(title);

	//Description
	const desc = document.createElement('p');
	desc.textContent = taskObj.description;
	li.appendChild(description);

	//Priority badge
	const badge = document.createElement('span');
	badge.classList.add('badge', taskObj.priority);
	badge.textContent = taskObj.priority;
	li.appendChild(badge);

	//Due date
	const due = document.createElement('small');
	due.textContent = 'Due: ${taskObj.dueDate}';
	li.appendChild(due);

	//Edit
	const editBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.setAttribute('data-action', 'edit');
	editBtn.setAttribute('data-id', taskObj.id);
	li.appendChild(editBtn);

	//Delete
	const delBtn = document.createElement('button');
	delBtn.textContent = 'Delete';
	delBtn.setAttribute('data-action', 'delete');
	delBtn.setAttribute('data-id', taskObj.id);
	li.appendChild(delBtn);

	return li;
}

function addTask(columnId, taskObj){
	tasks.push(taskObj);
	const column = document.querySelector('#${columnId} ul');
	const card = createTaskCard(taskObj);
	column.appendChild(card);
	updateCounter();
}

function deleteTask(taskId){
	const card = document.getElementById(taskId);
	if (card) {
		card.classList.add('fade-out');
		card.addEventListener('animationend' () => {
			card.remove();
			const index = tasks.findIndex(t => t.id === taskId);
			if (index !== -1) {tasks.splice(index, 1)};
			updateCounter();
		});
	}
}

function editTask(taskId){
	const task = tasks.find(t => t.id === taskId);
	if (!task) {return};

	const modal = document.getElementById('taskModal');
	modal.hidden = false;

	document.getElementById('taskTitle').value = task.title;
	document.getElementById('taskDescription').value = task.description;
	document.getElementById('taskPriority').value = task.priority;
	document.getElementById('taskDue').value = task.dueDate;

	modal.querySelector('form').onsubmit = (e) => {
		e.preventDefault();
		const updatedData = {
			title: document.getElementById('taskTitle').value,
			description: document.getElementById('taskDescription').value,
			priority: document.getElementById('taskPriority').value,
			dueDate: document.getElementById('taskDue').value
		};
		updateTask(taskId, updatedData);
		modal.hidden = true;
	};
}

function updateTask(taskId, updatedData){
	const task = tasks.find(t => t.id === taskId);
	if (!task) {return};

	Object.assign(task, updatedData);

	const card = document.getElementById(taskId);
	if (card) {
		card.querySelector('h4').textContent = task.title;
		card.querySelector('p').textContent = task.description;
		const badge = card.querySelector('span');
		badge.textContent = task.priority;
		badge.className = 'badge' + task.priority;
		card.querySelector('small').textContent = 'Due: ${task.dueDate}';
	}
}

function updateCounter() {
  const counter = document.querySelector('.kanban-counter label');
  counter.textContent = `Task counter: ${tasks.length}`;
}

document.querySelectorAll('.kanban-column ul').forEach(ul => {
	ul.addEventListener('click', (event) => {
		const action = event.target.getAttribute('data-action');
		const id = event.target.getAttribute('data-id');
		if (!action || !id) {return};
		if (action === 'edit') {editTask(id)};
		if (action === 'delete') {deleteTask(id)};
	});
});

// Close modal when Cancel button is clicked
document.getElementById('cancel').addEventListener('click', () => {
  document.getElementById('taskModal').hidden = true;
});


//Event Delegation
editBtn.setAttribute('data-action', 'edit');
editBtn.setAttribute('data-id', taskObj.id);

delBtn.setAttribute('data-action', 'delete');
delBtn.setAttribute('data-id', taskObj.id);

//Inline editing
document.addEventListener('dblclick', (event) => {
	if (event.target.tagName === 'H4') {
		const original = event.target.textContent;
		const input = document.createElement('input');
		input.type = 'text';
		input.value = original;

		event.target.replaceWith(input);
		input.focus();

		const commit = () => {
			const newTitle = input.value.trim() || original;
			const h4 = document.createElement('h4');
			h4.textContent = newTitle;
			input.replaceWith(h4);
		};

		input.addEventListener('blur', commit);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') commit();
		});
	}
});

//Priority filter
document.getElementById('priority-filter').addEventListener('change', (e) => {
	const selected = e.target.value;
	document.querySelectorAll('.task-card').forEach(card => {
		const priority = card.querySelector('.badge').textContent;
		const hide = selected !== 'all' && priority !== selected;
		card.classList.toggle('is-hidden', hide);
	});
});

//Clear done
document.querySelector('#done .add-task').insertAdjacentHTML(
	'afterend',
	'<button id="clearDone">Clear All</button>'
);

document.getElementById('clearDone').addEventListener('click', () => {
	const cards = document.querySelectorAll('#done .task-card');
	cards.forEach((card, index) => {
		setTimeout(() => {
			card.classList.add('fade-out');
			card.addEventListener('animationend', () => card.remove());
		} , index * 100);
	});
});