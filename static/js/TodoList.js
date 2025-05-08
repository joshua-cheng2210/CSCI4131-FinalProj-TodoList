var user;

async function populateTodoListList() {
    const listElement = document.getElementById('todoListItems'); 

    try {
        const response = await fetch('/getTodoList');

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
    console.log("handleTaskDone")
    console.log(taskId, isChecked)
    try {
        const response = await fetch(`/updatetodo`, { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ done: isChecked, taskId: taskId }),
        });

        const result = await response.json();
        if (result.success) {
            const listItem = document.querySelector(`.todo-item[data-task-id="${taskId}"]`);
            if (listItem) {
                listItem.classList.toggle('task-completed', isChecked);
            }
        } else {
            throw new Error("failed to update sql isChcked");
        }
    } catch (error) {
        console.error(error);
        
        const checkbox = document.querySelector(`.todo-checkbox[data-task-id="${taskId}"]`);
        if (checkbox) {
            checkbox.checked = !isChecked;
        }
    }
}

async function handleTaskDelete(taskId) {
    try {
        const response = await fetch(`/deletetodo/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            updateTodoList()
        }
        const result = await response.json();
        if (result.success) {
            
            const listItem = document.querySelector(`.todo-item[data-task-id="${taskId}"]`);
            if (listItem) {
                listItem.remove();
            }
        } 
    } catch (error) {
        console.error(error);
        updateTodoList()
    }
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

async function addGreetings() {
    console.log("addGreetings")
    const title = document.getElementById('greeting');
    console.log("addGreetings user: ", user)
    title.textContent = `Hi, ${user.username}! Here is your To-Do List.`;
}

async function getAccountInfo() {
    console.log("getAccountInfo")
    try {
        const response = await fetch('/getProfInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log("response.not ok")
            throw new Error("failed to get prof")
        }

        const result = await response.json();
        console.log("result: ", result)
        if (result.success) {
            user = result.user
            console.log("inside getAccountInfo user: ", user)
        } else {
            throw new Error("failed to get prof")
        }
    } catch (error) {
        console.log(error)
        window.location.href = '/login.html';
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // don't need this since back end is using express-session

    // user = JSON.parse(localStorage.getItem('user'));
    // if (user && user !== undefined && user !== null) {
    //     console.log("user: ", user)
    //     addGreetings()
    // } else {
    //     window.location.href = '/login.html';
    //     return
    // }
    try {
        await getAccountInfo()
        await addGreetings()
        await populateTodoListList()

        const form = document.getElementById("todo-form")
        if (form){
            form.addEventListener("submit", onNewTodoSubmit)
        }
    } catch (err) {
        console.log(err)
    }

    
});