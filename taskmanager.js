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
	editBtn.addEventListener('click', () => editTask(taskObj.id));
	li.appendChild(editBtn);

	//Delete
	const delBtn = document.createElement('button');
	delBtn.textContent = 'Delete';
	delBtn.addEventListener('click', () => deleteTask(taskObj.id));
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