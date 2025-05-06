async function populateTodoList() {
    const tableBody = document.querySelector('.TaskList-table tbody');

    try {
        const response = await fetch('/getTodoList'); 

        if (!response.ok) {
            throw new Error(`Failed to get todo. status -->${response.status}`);
        }
        
        let todos = await response.json(); 
        todos = todos.results
        
        console.log("response from front end: ", todos)

        todos.forEach(todo => {
            const row = document.createElement('tr');
            row.classList.add('todo-row');

            row.innerHTML = `
                <td>${todo.task || 'N/A'}</td>
                <td>${todo.deadline || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (err) {
        throw err
    }
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
            // alert('todo added :) view it in /mytodo.js');
            window.location.href = '/mytodo.html'
        } 

    } catch (err) {
        throw err
    }     
}


document.addEventListener('DOMContentLoaded', () => {
    populateTodoList()

    const form = document.getElementById("todo-form")
    if (form){
        form.addEventListener("submit", onNewTodoSubmit)
    }
});