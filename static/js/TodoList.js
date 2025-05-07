async function populateTodoListList() {
    const listElement = document.getElementById('todoListItems'); 

    try {
        const response = await fetch('/getTodoList');

        if (!response.ok) {
            throw new Error(`Failed to get todo. status -->${response.status}`);
        }

        let todos = await response.json();
        todos = todos.results; 

        console.log("response from front end: ", todos);

        if (!Array.isArray(todos)) {
            console.error("Error: Expected an array of todos, but received:", todos);
            todos = []; 
        }
        todos.forEach(todo => {
            const listItem = document.createElement('li'); 
            listItem.classList.add('todo-item'); 
            listItem.dataset.taskId = todo.taskID;

            let formattedDeadline = new Date(todo.deadline).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            const isDone = todo.done ? 'checked' : '';
            listItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${isDone} data-task-id="${todo.taskID}">
                <span class="task-work">${todo.task || 'N/A'}</span>
                <span class="task-deadline">Deadline: ${formattedDeadline}</span>
                <button class="delete-btn" data-task-id="${todo.taskID}">Delete</button> 
            `;

            const checkbox = listItem.querySelector('.todo-checkbox');
            if(checkbox){
                listItem.querySelector('.todo-checkbox').addEventListener('change', (event) => {
                    handleTaskDone(event.target.dataset.taskId, event.target.checked);
                });
            }

            const deleteButton = listItem.querySelector('.delete-btn');
            if(deleteButton){
                deleteButton.addEventListener('click', (event) => {
                    handleTaskDelete(event.target.dataset.taskId);
                });
            }

            listElement.appendChild(listItem);
        });
    } catch (err) {
        console.error("Error populating todo list:", err); 
    }
}
async function handleTaskDone(taskId, isChecked) {

}

async function handleTaskDelete(taskId) {

}
async function updateTodoList() {
    const todoListItems = document.getElementById('todoListItems');
    todoListItems.innerHTML = ''
    await populateTodoListList()
}

async function onNewTodoSubmit(event){
    event.preventDefault(); 
    
    const newTask = document.getElementById('newTaskInput').value; 
    const newTask_deadline = document.getElementById('newTask-deadline').value;

    const formData = {
        task: newTask,
        deadline: newTask_deadline,
        done: false
    };

    try {
        const response = await fetch('/addtodo', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(formData), 
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`status: ${response.status}`);
        }

        const result = await response.json(); 

        if (result.success) {
            updateTodoList()
        } 

    } catch (err) {
        throw err
    }     
}

document.addEventListener('DOMContentLoaded', () => {
    populateTodoListList()

    const form = document.getElementById("todo-form")
    if (form){
        form.addEventListener("submit", onNewTodoSubmit)
    }
});